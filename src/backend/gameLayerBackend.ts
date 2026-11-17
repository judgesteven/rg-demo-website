import type { RewardsBackend } from './RewardsBackend';

/**
 * Real GameLayer implementation. NOT IMPLEMENTED: the demo uses mockBackend.ts.
 *
 * Enable with VITE_BACKEND=gamelayer once these TODOs are done.
 *
 * TODO: Agree with GameLayer how each piece maps onto its API:
 *   - chapters    -> GameLayer missions grouped by tag or quest
 *   - points      -> GameLayer points, with a good-cause conversion rate
 *   - badges      -> GameLayer achievements
 *   - shared goal -> a GameLayer team or community counter
 * TODO: Player auth. The player app runs inside the operator's app or site,
 *   which passes a short-lived token for the pseudonymised player ID. Never
 *   ship an API key to the browser.
 * TODO: sendEvent belongs server-to-server (operator platform -> GameLayer).
 *   The browser method should only exist for the demo; drop it or proxy it.
 * TODO: subscribeTo* via GameLayer webhooks relayed over SSE or WebSocket
 *   (or polling as a first step).
 */

export interface GameLayerConfig {
  /** e.g. https://api.gamelayer.co (TODO: confirm). */
  baseUrl: string;
  /** Account or tenant ID for the operator. */
  accountId: string;
  /** Returns a short-lived player token from the operator's own backend. */
  getToken: () => Promise<string>;
}

const notImplemented = (method: string): never => {
  throw new Error(`gameLayerBackend.${method} is not implemented yet. Use the mock backend.`);
};

export function createGameLayerBackend(_config: GameLayerConfig): RewardsBackend {
  return {
    // TODO: GET {baseUrl}/missions?player={playerId}, map to Chapter[]
    getMissions: async () => notImplemented('getMissions'),
    // TODO: GET {baseUrl}/players/{playerId}, map points, achievements and completed missions
    getPlayerState: async () => notImplemented('getPlayerState'),
    // TODO: GET the shared community counter
    getSharedGoal: async () => notImplemented('getSharedGoal'),
    // TODO: POST {baseUrl}/missions/{missionId}/complete for on-page missions
    completeMission: async () => notImplemented('completeMission'),
    // TODO: POST {baseUrl}/events { player, event } (server-to-server in production)
    sendEvent: async () => notImplemented('sendEvent'),
    // TODO: GET pilot-wide aggregates (players, completions per mission)
    getPilotStats: async () => notImplemented('getPilotStats'),
    subscribeToPilotStats: () => notImplemented('subscribeToPilotStats'),
    // TODO: GET recent events for the operator dashboard
    getRecentEvents: async () => notImplemented('getRecentEvents'),
    // TODO: subscribe via SSE/WebSocket relay of GameLayer webhooks
    subscribeToEvents: () => notImplemented('subscribeToEvents'),
    subscribeToPlayerState: () => notImplemented('subscribeToPlayerState'),
    subscribeToSharedGoal: () => notImplemented('subscribeToSharedGoal'),
  };
}
