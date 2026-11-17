import type { EventName } from '../backend/RewardsBackend';

/** Events already in the live feed when the dashboard opens. */
export const seedEvents: { name: EventName; playerId: string; secondsAgo: number; confirmedInMs: number }[] = [
  { name: 'limit_reviewed', playerId: '7f3a5c0e8d2b91c2', secondsAgo: 14, confirmedInMs: 300 },
  { name: 'self_assessment_completed', playerId: '2b81d4f6a39c0e7d', secondsAgo: 27, confirmedInMs: 400 },
  { name: 'play_history_viewed', playerId: 'c904e1b72f685a13', secondsAgo: 42, confirmedInMs: 300 },
  { name: 'play_history_viewed', playerId: '58de3a0c94e7b6f0', secondsAgo: 70, confirmedInMs: 200 },
  { name: 'self_assessment_completed', playerId: 'e17c9b5d0a4f3d28', secondsAgo: 95, confirmedInMs: 400 },
];

/** Actions the team dashboard can simulate, in menu order. */
export const simulateOptions: { event: EventName; label: string }[] = [
  { event: 'self_assessment_completed', label: 'Completes the self-assessment' },
  { event: 'limit_reviewed', label: 'Reviews their spend limit' },
  { event: 'play_history_viewed', label: 'Checks their play history' },
  { event: 'location_checkin', label: 'Checks in at a funded project' },
  { event: 'player_excluded', label: 'Self-excludes (leaves the pilot)' },
];

/** What each event changes in the pilot-wide results. */
export const eventStatEffects: Record<EventName, { missionId?: string; playersDelta?: number }> = {
  self_assessment_completed: { missionId: 'assess' },
  limit_reviewed: { missionId: 'limit' },
  play_history_viewed: { missionId: 'history' },
  location_checkin: { missionId: 'visit' },
  player_excluded: { playersDelta: -1 },
};

/** Confirmation times for simulated players, in ms. */
export const simulatedConfirmMs = { min: 200, max: 500, step: 100 };

/** Events that count as using a safer-play tool in the player's account. */
export const toolEvents: EventName[] = ['play_history_viewed', 'limit_reviewed', 'self_assessment_completed'];

/** How many events the mock keeps and the feed shows. */
export const EVENT_HISTORY = 50;
export const FEED_LENGTH = 6;
