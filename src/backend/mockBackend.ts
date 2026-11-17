import type {
  Chapter,
  CompletionResult,
  EventName,
  Mission,
  PlayerId,
  PilotStats,
  PlayerState,
  RewardsBackend,
  RewardsEvent,
  SharedGoal,
} from './RewardsBackend';
import { chapters } from '../data/missions';
import { PENCE_PER_POINT, demoPlayer, demoPlayerStart, newPlayerStart, sharedGoalStart } from '../data/player';
import { EVENT_HISTORY, eventStatEffects, seedEvents, simulatedConfirmMs, toolEvents } from '../data/events';
import { missionResults, pilotMeta } from '../data/team';
import { randomHex } from '../lib/ids';

/**
 * In-memory rewards engine for the sales demo.
 *
 * Each browser tab has its own copy. Tabs keep each other in sync over a
 * BroadcastChannel, so completing a mission in /player shows up straight away
 * in the /team live feed in another tab. A newly opened tab asks its peers for
 * a snapshot so it starts from the same state.
 */

const CHANNEL_NAME = 'safer-play-rewards';

type Message =
  | { type: 'event'; event: RewardsEvent }
  | { type: 'player'; state: PlayerState }
  | { type: 'goal'; goal: SharedGoal }
  | { type: 'stats'; stats: PilotStats }
  | { type: 'hello'; from: string }
  | {
      type: 'snapshot';
      to: string;
      events: RewardsEvent[];
      players: PlayerState[];
      goal: SharedGoal;
      stats: PilotStats;
    };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const allMissions = (): Mission[] => chapters.flatMap((c) => c.missions);

const chapterOf = (missionId: string) => chapters.find((c) => c.missions.some((m) => m.id === missionId));

const isUnlocked = (missionId: string, state: PlayerState) => {
  const ch = chapterOf(missionId);
  return !!ch && ch.unlockWeek <= state.currentWeek;
};

function simulatedConfirm(): number {
  const { min, max, step } = simulatedConfirmMs;
  const steps = Math.floor((max - min) / step) + 1;
  return min + Math.floor(Math.random() * steps) * step;
}

export function createMockBackend(): RewardsBackend {
  const tabId = randomHex(4);
  const players = new Map<PlayerId, PlayerState>();
  let goal: SharedGoal = { ...sharedGoalStart, updatedAt: 0 };
  let events: RewardsEvent[] = seedEvents.map((s, i) => ({
    id: `seed-${i}`,
    name: s.name,
    playerId: s.playerId,
    occurredAt: new Date(Date.now() - s.secondsAgo * 1000).toISOString(),
    confirmedInMs: s.confirmedInMs,
  }));

  let stats: PilotStats = {
    players: pilotMeta.players,
    missionCompletions: Object.fromEntries(
      missionResults.map((r) => [r.missionId, Math.round((pilotMeta.players * r.completedPct) / 100)]),
    ),
    updatedAt: 0,
  };
  const statsSubs = new Set<(s: PilotStats) => void>();

  const eventSubs = new Set<(e: RewardsEvent) => void>();
  const playerSubs = new Map<PlayerId, Set<(s: PlayerState) => void>>();
  const goalSubs = new Set<(g: SharedGoal) => void>();

  const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(CHANNEL_NAME) : null;
  const post = (msg: Message) => channel?.postMessage(msg);

  function ensurePlayer(id: PlayerId): PlayerState {
    let s = players.get(id);
    if (!s) {
      s =
        id === demoPlayer.id
          ? { ...demoPlayerStart, completedMissionIds: [...demoPlayerStart.completedMissionIds], updatedAt: 0 }
          : { ...newPlayerStart, playerId: id, completedMissionIds: [], updatedAt: 0 };
      players.set(id, s);
    }
    return s;
  }

  function setPlayer(next: PlayerState, broadcast = true) {
    players.set(next.playerId, next);
    playerSubs.get(next.playerId)?.forEach((cb) => cb(next));
    if (broadcast) post({ type: 'player', state: next });
  }

  function setGoal(next: SharedGoal, broadcast = true) {
    goal = next;
    goalSubs.forEach((cb) => cb(goal));
    if (broadcast) post({ type: 'goal', goal });
  }

  function addEvent(e: RewardsEvent, broadcast = true) {
    if (events.some((x) => x.id === e.id)) return;
    events = [e, ...events]
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
      .slice(0, EVENT_HISTORY);
    eventSubs.forEach((cb) => cb(e));
    if (broadcast) post({ type: 'event', event: e });
  }

  function setStats(next: PilotStats, broadcast = true) {
    stats = next;
    statsSubs.forEach((cb) => cb(stats));
    if (broadcast) post({ type: 'stats', stats });
  }

  /** Apply a change to the pilot-wide results: a mission completion and/or a change in players. */
  function updateStats({ missionId, playersDelta = 0 }: { missionId?: string; playersDelta?: number }) {
    const missionCompletions = { ...stats.missionCompletions };
    if (missionId) missionCompletions[missionId] = (missionCompletions[missionId] ?? 0) + 1;
    setStats({ players: stats.players + playersDelta, missionCompletions, updatedAt: Date.now() });
  }

  function bumpGoal() {
    setGoal({ ...goal, current: goal.current + 1, updatedAt: Date.now() });
  }

  function applyCompletion(state: PlayerState, mission: Mission): PlayerState {
    return {
      ...state,
      points: state.points + mission.points,
      donatedPence: state.donatedPence + mission.points * PENCE_PER_POINT,
      completedMissionIds: [...state.completedMissionIds, mission.id],
      updatedAt: Date.now(),
    };
  }

  channel?.addEventListener('message', (ev: MessageEvent<Message>) => {
    const msg = ev.data;
    switch (msg.type) {
      case 'event':
        addEvent(msg.event, false);
        break;
      case 'player': {
        const mine = players.get(msg.state.playerId);
        if (!mine || msg.state.updatedAt >= mine.updatedAt) setPlayer(msg.state, false);
        break;
      }
      case 'goal':
        if (msg.goal.updatedAt >= goal.updatedAt) setGoal(msg.goal, false);
        break;
      case 'stats':
        if (msg.stats.updatedAt >= stats.updatedAt) setStats(msg.stats, false);
        break;
      case 'hello':
        post({ type: 'snapshot', to: msg.from, events, players: [...players.values()], goal, stats });
        break;
      case 'snapshot':
        if (msg.to !== tabId) break;
        msg.events.forEach((e) => addEvent(e, false));
        msg.players.forEach((p) => {
          // The demo player always starts fresh on page load, so a refresh resets the player app.
          if (p.playerId === demoPlayer.id) return;
          const mine = players.get(p.playerId);
          if (!mine || p.updatedAt > mine.updatedAt) setPlayer(p, false);
        });
        if (msg.goal.updatedAt > goal.updatedAt) setGoal(msg.goal, false);
        if (msg.stats.updatedAt > stats.updatedAt) setStats(msg.stats, false);
        break;
    }
  });
  post({ type: 'hello', from: tabId });

  return {
    async getMissions() {
      return chapters as Chapter[];
    },

    async getPlayerState(playerId) {
      return ensurePlayer(playerId);
    },

    async getSharedGoal() {
      return goal;
    },

    async completeMission(playerId, missionId) {
      const state = ensurePlayer(playerId);
      const mission = allMissions().find((m) => m.id === missionId);
      if (!mission) throw new Error(`Unknown mission: ${missionId}`);
      if (mission.event) throw new Error(`Mission ${missionId} is confirmed by the operator event ${mission.event}`);
      if (state.excluded || state.completedMissionIds.includes(missionId) || !isUnlocked(missionId, state)) {
        return { state, pointsAwarded: 0 } satisfies CompletionResult;
      }
      const next = applyCompletion(state, mission);
      setPlayer(next);
      bumpGoal();
      updateStats({ missionId: mission.id });
      return { state: next, pointsAwarded: mission.points };
    },

    async sendEvent(playerId, eventName: EventName) {
      const confirmedInMs = playerId === demoPlayer.id ? demoPlayer.confirmMs : simulatedConfirm();
      await sleep(confirmedInMs);

      let state = ensurePlayer(playerId);
      let missionId: string | undefined;

      if (eventName === 'player_excluded') {
        state = { ...state, excluded: true, updatedAt: Date.now() };
      } else if (!state.excluded) {
        const mission = allMissions().find(
          (m) => m.event === eventName && !state.completedMissionIds.includes(m.id) && isUnlocked(m.id, state),
        );
        if (mission) {
          state = applyCompletion(state, mission);
          missionId = mission.id;
        }
        if (toolEvents.includes(eventName)) {
          state = { ...state, toolsUsedThisMonth: state.toolsUsedThisMonth + 1, updatedAt: Date.now() };
        }
      }

      const event: RewardsEvent = {
        id: randomHex(8),
        name: eventName,
        playerId,
        occurredAt: new Date().toISOString(),
        confirmedInMs,
        missionId,
      };
      setPlayer(state);
      if (eventName !== 'player_excluded' && !state.excluded) bumpGoal();
      updateStats(eventStatEffects[eventName]);
      addEvent(event);
      return event;
    },

    async getPilotStats() {
      return stats;
    },

    subscribeToPilotStats(callback) {
      statsSubs.add(callback);
      return () => statsSubs.delete(callback);
    },

    async getRecentEvents(limit) {
      return events.slice(0, limit);
    },

    subscribeToEvents(callback) {
      eventSubs.add(callback);
      return () => eventSubs.delete(callback);
    },

    subscribeToPlayerState(playerId, callback) {
      const set = playerSubs.get(playerId) ?? new Set();
      set.add(callback);
      playerSubs.set(playerId, set);
      return () => set.delete(callback);
    },

    subscribeToSharedGoal(callback) {
      goalSubs.add(callback);
      return () => goalSubs.delete(callback);
    },
  };
}
