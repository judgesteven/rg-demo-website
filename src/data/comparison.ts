/**
 * "You and other players" in the player app. Pilot and everyone-else figures
 * are pilot averages; the player's own value comes from their state.
 */

export type YouSource =
  /** Count of safer-play tools the player used this month. */
  | { kind: 'toolsUsed' }
  /** Yes / Not yet, based on whether a mission is completed. */
  | { kind: 'mission'; missionId: string };

export interface ComparisonMeasure {
  id: string;
  label: string;
  /** 'count' values are plotted against `scaleMax`; 'percent' against 100. */
  unit: 'count' | 'percent';
  scaleMax: number;
  you: YouSource;
  pilot: number;
  everyone: number;
}

export const comparisonMeasures: ComparisonMeasure[] = [
  {
    id: 'tools',
    label: 'Safer-play tools used this month',
    unit: 'count',
    scaleMax: 4,
    you: { kind: 'toolsUsed' },
    pilot: 2.4,
    everyone: 0.6,
  },
  {
    id: 'assess',
    label: 'Have taken the self-assessment',
    unit: 'percent',
    scaleMax: 100,
    you: { kind: 'mission', missionId: 'assess' },
    pilot: 41,
    everyone: 9,
  },
  {
    id: 'limit',
    label: 'Have reviewed a limit',
    unit: 'percent',
    scaleMax: 100,
    you: { kind: 'mission', missionId: 'limit' },
    pilot: 28,
    everyone: 6,
  },
];

export const comparisonSeries = [
  { key: 'you', label: 'You', color: 'var(--acc)' },
  { key: 'pilot', label: 'Pilot players', color: 'var(--blue)' },
  { key: 'everyone', label: 'Everyone else', color: 'var(--grey)' },
] as const;
