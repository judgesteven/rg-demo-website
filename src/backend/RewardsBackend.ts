/**
 * The contract between the demo UI and a rewards engine.
 *
 * The demo runs on `mockBackend.ts`. A real deployment swaps in
 * `gameLayerBackend.ts`, which talks to the GameLayer API. Components only
 * ever import the `backend` instance from `./index`, never an implementation.
 */

/** Events the operator's platform sends when a player uses a safer-play tool. */
export type EventName =
  | 'play_history_viewed'
  | 'limit_reviewed'
  | 'self_assessment_completed'
  | 'location_checkin'
  | 'player_excluded';

export const EVENT_NAMES: readonly EventName[] = [
  'play_history_viewed',
  'limit_reviewed',
  'self_assessment_completed',
  'location_checkin',
  'player_excluded',
];

/**
 * A pseudonymised player ID. The operator generates it; no personal data ever
 * reaches the rewards engine.
 */
export type PlayerId = string;

/** Where the player completes a mission. */
export type MissionWhere = 'page' | 'account' | 'place';

export interface Mission {
  id: string;
  title: string;
  description: string;
  where: MissionWhere;
  /** Button label. */
  cta: string;
  points: number;
  /** Optional card image. Without one, the app shows placeholder artwork. */
  image?: { src: string; alt: string };
  /**
   * For account and location missions: the operator event that confirms it.
   * Missions without an event are completed on the pilot page itself.
   */
  event?: EventName;
}

export interface Chapter {
  id: string;
  number: number;
  name: string;
  /** Badge awarded when every mission in the chapter is done. */
  badge: string;
  /** Pilot weeks the chapter covers, e.g. [1, 2]. */
  weeks: [number, number];
  /** Week of the player's pilot in which the chapter opens. */
  unlockWeek: number;
  missions: Mission[];
}

export interface PlayerState {
  playerId: PlayerId;
  /** First name, shown only inside the operator's own app. */
  firstName: string;
  points: number;
  donatedPence: number;
  completedMissionIds: string[];
  /** The player's week in the pilot (drives chapter unlocks). */
  currentWeek: number;
  /** Safer-play tools used this month (account events). */
  toolsUsedThisMonth: number;
  /** True once a `player_excluded` event arrives. */
  excluded: boolean;
  /** Epoch ms of the last change, used to merge state between tabs. */
  updatedAt: number;
}

export interface SharedGoal {
  current: number;
  target: number;
  /** Donation unlocked when the target is reached, in pence. */
  rewardPence: number;
  updatedAt: number;
}

export interface RewardsEvent {
  id: string;
  name: EventName;
  playerId: PlayerId;
  /** ISO 8601 timestamp. */
  occurredAt: string;
  /** Time from event received to mission updated. */
  confirmedInMs: number;
  /** Mission completed by this event, if any. */
  missionId?: string;
}

/** Pilot-wide results for the operator dashboard. */
export interface PilotStats {
  /** Players currently in the pilot. */
  players: number;
  /** Players who have completed each mission, by mission ID. */
  missionCompletions: Record<string, number>;
  updatedAt: number;
}

export interface CompletionResult {
  state: PlayerState;
  pointsAwarded: number;
}

export type Unsubscribe = () => void;

export interface RewardsBackend {
  /** Missions grouped into chapters, as this player sees them. */
  getMissions(playerId: PlayerId): Promise<Chapter[]>;

  getPlayerState(playerId: PlayerId): Promise<PlayerState>;

  /** Progress towards the pilot-wide shared goal. */
  getSharedGoal(): Promise<SharedGoal>;

  /** Complete a mission that lives on the pilot page (quiz, story, cards). */
  completeMission(playerId: PlayerId, missionId: string): Promise<CompletionResult>;

  /**
   * Record an operator event for a player. In production the operator's
   * platform calls this server-to-server; the demo calls it from the browser.
   */
  sendEvent(playerId: PlayerId, eventName: EventName): Promise<RewardsEvent>;

  /** Pilot-wide results for the operator dashboard. */
  getPilotStats(): Promise<PilotStats>;

  /** Most recent events across all players, newest first. */
  getRecentEvents(limit: number): Promise<RewardsEvent[]>;

  subscribeToEvents(callback: (event: RewardsEvent) => void): Unsubscribe;

  subscribeToPlayerState(playerId: PlayerId, callback: (state: PlayerState) => void): Unsubscribe;

  subscribeToSharedGoal(callback: (goal: SharedGoal) => void): Unsubscribe;

  subscribeToPilotStats(callback: (stats: PilotStats) => void): Unsubscribe;
}
