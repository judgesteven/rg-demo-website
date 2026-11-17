import { useCallback, useEffect, useState } from 'react';
import { backend, type Chapter, type Mission, type PlayerId, type PlayerState, type SharedGoal } from '../backend';

export interface MissionOutcome {
  pointsAwarded: number;
  /** The player's state after the mission. */
  state: PlayerState;
  /** Set when the operator confirmed the mission through an event. */
  confirmedInMs?: number;
}

/** Loads a player's missions, state and the shared goal, and keeps them live. */
export function usePlayer(playerId: PlayerId) {
  const [chapters, setChapters] = useState<Chapter[] | null>(null);
  const [state, setState] = useState<PlayerState | null>(null);
  const [goal, setGoal] = useState<SharedGoal | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all([backend.getMissions(playerId), backend.getPlayerState(playerId), backend.getSharedGoal()]).then(
      ([c, s, g]) => {
        if (!live) return;
        setChapters(c);
        setState(s);
        setGoal(g);
      },
    );
    const offState = backend.subscribeToPlayerState(playerId, setState);
    const offGoal = backend.subscribeToSharedGoal(setGoal);
    return () => {
      live = false;
      offState();
      offGoal();
    };
  }, [playerId]);

  const complete = useCallback(
    async (mission: Mission): Promise<MissionOutcome> => {
      if (mission.event) {
        // Account missions: the operator confirms with an event.
        const event = await backend.sendEvent(playerId, mission.event);
        return {
          pointsAwarded: event.missionId ? mission.points : 0,
          confirmedInMs: event.confirmedInMs,
          state: await backend.getPlayerState(playerId),
        };
      }
      const result = await backend.completeMission(playerId, mission.id);
      return { pointsAwarded: result.pointsAwarded, state: result.state };
    },
    [playerId],
  );

  return { chapters, state, goal, complete };
}
