/** Sample data for the operator's team dashboard (/team). */

export const pilotMeta = {
  /** Players in the pilot; mission completion counts are derived from this. */
  players: 12480,
  week: 8,
  totalWeeks: 12,
  comparisonGroup: 'eligible players who weren’t invited',
};

export const teamTitle = 'Responsible play pilot';

/**
 * KPI cards. `players` and `mission` KPIs are computed from live pilot stats,
 * so simulated events move them; `fixed` KPIs show a sample value.
 */
export type Kpi = {
  id: string;
  label: string;
  context: string;
} & (
  | { source: 'players' }
  | { source: 'mission'; missionId: string }
  | { source: 'fixed'; value: number }
);

export const kpis: Kpi[] = [
  { id: 'joined', source: 'players', label: 'players in the pilot', context: '31% of 40,000 invited chose to join' },
  { id: 'assess', source: 'mission', missionId: 'assess', label: 'have taken the self-assessment', context: 'vs 9% in the comparison group' },
  { id: 'limit', source: 'mission', missionId: 'limit', label: 'have reviewed a limit', context: 'vs 6% in the comparison group' },
  { id: 'tools', source: 'fixed', value: 2.4, label: 'safer-play tools used per player a month', context: 'vs 0.6 in the comparison group' },
];

/** How long a changed KPI or table row stays highlighted. */
export const HIGHLIGHT_MS = 4000;

/** Self-assessments per 1,000 players, by pilot week. */
export const weeklyChart = {
  title: 'Self-assessments per 1,000 players, by week',
  yMax: 70,
  yTicks: [0, 20, 40, 60],
  series: [
    { id: 'pilot', label: 'Pilot', shortLabel: 'Pilot', color: 'var(--acc)', values: [12, 38, 44, 51, 47, 55, 58, 61] },
    { id: 'comparison', label: 'Comparison', shortLabel: 'Comp.', color: 'var(--blue)', values: [9, 10, 8, 11, 9, 10, 12, 10] },
  ],
};


/**
 * Mission results at the start of the demo. Title and location come from the
 * mission data; completion counts are seeded from completedPct × players.
 */
export const missionResults: { missionId: string; startedPct: number; completedPct: number }[] = [
  { missionId: 'reflect', startedPct: 88, completedPct: 81 },
  { missionId: 'history', startedPct: 74, completedPct: 69 },
  { missionId: 'odds', startedPct: 71, completedPct: 64 },
  { missionId: 'limit', startedPct: 39, completedPct: 28 },
  { missionId: 'assess', startedPct: 52, completedPct: 41 },
  { missionId: 'myths', startedPct: 58, completedPct: 53 },
  { missionId: 'checkin', startedPct: 22, completedPct: 19 },
  { missionId: 'causes', startedPct: 18, completedPct: 15 },
  { missionId: 'visit', startedPct: 6, completedPct: 4 },
];

export const teamWhereLabels = {
  page: 'Pilot page',
  account: 'Player account',
  place: 'Location',
} as const;

