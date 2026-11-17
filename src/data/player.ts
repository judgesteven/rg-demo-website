import type { PlayerState, SharedGoal } from '../backend/RewardsBackend';

/** Pence donated per good-cause point. */
export const PENCE_PER_POINT = 1;

/** The demo player shown in the player app. The ID is pseudonymised. */
export const demoPlayer = {
  id: 'a4c7e2d95b0f3816',
  firstName: 'Sam',
  /** Time the operator takes to confirm an account mission. */
  confirmMs: 400,
};

/**
 * Where the demo player starts on every page load: week 4 of the pilot (so
 * chapters 1 and 2 are open and chapter 3 is locked), with nothing done yet.
 */
export const demoPlayerStart: Omit<PlayerState, 'updatedAt'> = {
  playerId: demoPlayer.id,
  firstName: demoPlayer.firstName,
  points: 0,
  donatedPence: 0,
  completedMissionIds: [],
  currentWeek: 4,
  toolsUsedThisMonth: 0,
  excluded: false,
};

/** Starting state for any other (simulated) pilot player. */
export const newPlayerStart: Omit<PlayerState, 'playerId' | 'updatedAt'> = {
  firstName: '',
  points: 0,
  donatedPence: 0,
  completedMissionIds: [],
  currentWeek: 1,
  toolsUsedThisMonth: 0,
  excluded: false,
};

/** Pilot-wide shared goal: safer-play check-ins by all pilot players. */
export const sharedGoalStart: Omit<SharedGoal, 'updatedAt'> = {
  current: 7420,
  target: 10000,
  rewardPence: 1_000_000,
};

/** How long the confirmation toast stays on screen. */
export const TOAST_MS = 3500;
