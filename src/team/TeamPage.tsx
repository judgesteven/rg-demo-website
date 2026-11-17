import { useEffect, useRef, useState } from 'react';
import { backend, type PilotStats } from '../backend';
import { useOperator } from '../state/OperatorContext';
import { chapters } from '../data/missions';
import {
  HIGHLIGHT_MS,
  kpis,
  missionResults,
  pilotMeta,
  teamTitle,
  weeklyChart,
  type Kpi,
} from '../data/team';
import { formatInt } from '../lib/format';
import { Bar } from '../components/Bar';
import { TrendChart } from './TrendChart';
import { LiveFeed } from './LiveFeed';

const missionsById = new Map(chapters.flatMap((c) => c.missions).map((m) => [m.id, m]));

const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

function kpiValue(k: Kpi, s: PilotStats): { main: string; count?: number } {
  switch (k.source) {
    case 'players':
      return { main: formatInt(s.players) };
    case 'mission': {
      const n = s.missionCompletions[k.missionId] ?? 0;
      return { main: `${pct(n, s.players)}%`, count: n };
    }
    case 'fixed':
      return { main: k.value.toFixed(1) };
  }
}

/** What the latest update changed, so the page can highlight and describe it. */
export interface StatsChange {
  missionIds: string[];
  playersDelta: number;
  text: string;
}

function diffStats(prev: PilotStats, next: PilotStats): StatsChange | null {
  const missionIds = Object.keys(next.missionCompletions).filter(
    (id) => next.missionCompletions[id] !== prev.missionCompletions[id],
  );
  const playersDelta = next.players - prev.players;
  if (!missionIds.length && !playersDelta) return null;
  const parts = missionIds.map((id) => {
    const d = next.missionCompletions[id] - (prev.missionCompletions[id] ?? 0);
    return `“${missionsById.get(id)?.title ?? id}” completions ${formatDelta(d)}`;
  });
  if (playersDelta) parts.push(`players in the pilot ${formatDelta(playersDelta)}`);
  const text = parts.join(', ');
  return { missionIds, playersDelta, text: `${text[0].toUpperCase()}${text.slice(1)}.` };
}

const formatDelta = (d: number) => `${d < 0 ? '−' : '+'}${formatInt(Math.abs(d))}`;

const kpiChanged = (k: Kpi, c: StatsChange) =>
  (k.source === 'players' && c.playersDelta !== 0) || (k.source === 'mission' && c.missionIds.includes(k.missionId));

/** The pilot-wide figures, kept live, plus what the latest update changed. */
function usePilotStats() {
  const [stats, setStats] = useState<PilotStats | null>(null);
  const [change, setChange] = useState<StatsChange | null>(null);
  const prev = useRef<PilotStats | null>(null);
  const timer = useRef<number>();

  useEffect(() => {
    let live = true;
    const apply = (next: PilotStats) => {
      if (!live) return;
      const diff = prev.current ? diffStats(prev.current, next) : null;
      prev.current = next;
      setStats(next);
      if (diff) {
        setChange(diff);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setChange(null), HIGHLIGHT_MS);
      }
    };
    backend.getPilotStats().then(apply);
    const off = backend.subscribeToPilotStats(apply);
    return () => {
      live = false;
      off();
      window.clearTimeout(timer.current);
    };
  }, []);

  return { stats, change };
}

export function TeamPage() {
  const { name } = useOperator();
  const { stats, change } = usePilotStats();

  return (
    <section className="band team-page">
      <div className="wrap">
        <h1>
          {teamTitle}: week {pilotMeta.week} of {pilotMeta.totalWeeks}
        </h1>
        <p className="team-lede">
          How {name} players in the pilot are using responsible play tools, compared with{' '}
          {pilotMeta.comparisonGroup}.
        </p>

        {stats && (
          <ul className="kpis">
            {kpis.map((k) => {
              const v = kpiValue(k, stats);
              return (
                <li className={change && kpiChanged(k, change) ? 'kpi is-updated' : 'kpi'} key={k.id}>
                  <b>{v.main}</b>
                  <span>
                    {k.label}
                    {v.count !== undefined && ` (${formatInt(v.count)} players)`}
                  </span>
                  <em className={k.comparison ? 'is-comparison' : undefined}>{k.context}</em>
                </li>
              );
            })}
          </ul>
        )}
        <p className="source kpi-source">Pilot data from GameLayer. Comparison data from {name}.</p>

        <div className="row">
          <section className="panel main" aria-labelledby="chart-title">
            <div className="panel-head">
              <h2 id="chart-title">{weeklyChart.title}</h2>
              <ul className="legend" aria-label="Key">
                {weeklyChart.series.map((s) => (
                  <li key={s.id}>
                    <i style={{ background: s.color }} />
                    {s.label}
                  </li>
                ))}
              </ul>
            </div>
            <TrendChart />
            <p className="source">Pilot: GameLayer. Comparison: {name} reporting.</p>
          </section>
        </div>

        <div className="row">
          <section className="panel main" aria-labelledby="missions-title">
            <h2 id="missions-title">Missions</h2>
            {stats && (
              <table className="results">
                <thead>
                  <tr>
                    <th scope="col">Mission</th>
                    <th scope="col" className="num col-num">Started</th>
                    <th scope="col" className="bar-cell">
                      <span className="visually-hidden">Completed, as a bar</span>
                    </th>
                    <th scope="col" className="num col-num">Completed</th>
                    <th scope="col" className="num col-num col-last">Completions</th>
                  </tr>
                </thead>
                <tbody>
                  {missionResults.map((r) => {
                    const m = missionsById.get(r.missionId);
                    if (!m) return null;
                    const completions = stats.missionCompletions[m.id] ?? 0;
                    return (
                      <tr key={r.missionId} className={change?.missionIds.includes(m.id) ? 'is-updated' : undefined}>
                        <th scope="row" data-label="Mission">{m.title}</th>
                        <td className="num col-num" data-label="Started">{r.startedPct}%</td>
                        <td className="bar-cell" aria-hidden="true">
                          <span className="cell-bar">
                            <Bar pct={pct(completions, stats.players)} color="var(--acc)" />
                          </span>
                        </td>
                        <td className="num col-num" data-label="Completed">
                          <b>{pct(completions, stats.players)}%</b>
                        </td>
                        <td className="num col-num col-last" data-label="Completions">{formatInt(completions)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>

          <LiveFeed changeText={change?.text ?? null} />
        </div>
      </div>
    </section>
  );
}
