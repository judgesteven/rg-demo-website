import { useState } from 'react';
import type { Chapter, Mission, PlayerState, SharedGoal } from '../backend';
import { usePlayer } from './usePlayer';
import { useOperator } from '../state/OperatorContext';
import { demoPlayer } from '../data/player';
import { comparisonMeasures, comparisonSeries, type ComparisonMeasure } from '../data/comparison';
import { Bar } from '../components/Bar';
import { OperatorMark } from '../components/OperatorMark';
import { Badges, evaluateBadges } from './Badges';
import { ChapterSection, chapterFocusId } from './ChapterSection';
import { formatInt, formatPence, formatPenceWhole, formatSeconds } from '../lib/format';

const earnedIds = (chapters: Chapter[], s: PlayerState) =>
  evaluateBadges(chapters, s)
    .filter((b) => b.status === 'earned')
    .map((b) => b.def.id);

export function PlayerApp({ onToast }: { onToast: (text: string) => void }) {
  const { name: operator } = useOperator();
  const { chapters, state, goal, complete } = usePlayer(demoPlayer.id);
  const [pending, setPending] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  if (!chapters || !state || !goal) {
    return <p className="app-loading">Loading your missions…</p>;
  }

  async function handleMission(m: Mission) {
    if (pending) return;
    setPending(m.id);
    try {
      const before = new Set(earnedIds(chapters!, state!));
      const outcome = await complete(m);
      const newBadges = evaluateBadges(chapters!, outcome.state)
        .filter((b) => b.status === 'earned' && !before.has(b.def.id))
        .map((b) => b.def.name);
      const pts = `+${outcome.pointsAwarded} good-cause points`;
      const badgeText = newBadges.length ? ` Badge earned: ${newBadges.join(', ')}.` : '';
      onToast(
        (outcome.confirmedInMs !== undefined
          ? `Confirmed by ${operator} in ${formatSeconds(outcome.confirmedInMs)} seconds. ${pts}.`
          : `${pts}.`) + badgeText,
      );
      const ch = chapters!.find((c) => c.missions.some((x) => x.id === m.id));
      const chapterDone = !!ch && ch.missions.every((x) => outcome.state.completedMissionIds.includes(x.id));
      setFocusId(chapterDone && ch ? chapterFocusId(ch.id) : m.id);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <OperatorMark size={40} />
          <div>
            <small>{operator}</small>
            <b>Safer Play Rewards</b>
          </div>
        </div>
        <span className="chip">Pilot</span>
      </header>

      {state.excluded && (
        <p className="app-banner">You've left the pilot. Your points so far still go to good causes.</p>
      )}

      <PointsCard chapters={chapters} state={state} />

      {chapters.map((ch) => (
        <ChapterSection
          key={ch.id}
          chapter={ch}
          state={state}
          operator={operator}
          pending={pending}
          focusId={focusId}
          onComplete={handleMission}
        />
      ))}

      <Badges views={evaluateBadges(chapters, state)} />
      <Comparison state={state} />
      <Together goal={goal} />
    </div>
  );
}

function PointsCard({ chapters, state }: { chapters: Chapter[]; state: PlayerState }) {
  // Overall progress across every mission in the pilot, so each completed mission moves the bar.
  const all = chapters.flatMap((c) => c.missions);
  const total = all.length;
  const done = all.filter((m) => state.completedMissionIds.includes(m.id)).length;
  return (
    <section className="points" aria-label="Your good-cause points">
      <small>Hi {state.firstName}, your good-cause points</small>
      <div className="points-n">{formatInt(state.points)}</div>
      <span>That's {formatPence(state.donatedPence)} donated in your name so far.</span>
      <div className="points-progress">
        <span>Your progress</span>
        <span>
          {done} of {total} missions
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Missions completed"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
      >
        <Bar pct={(done / total) * 100} color="var(--hero-acc)" onDark />
      </div>
    </section>
  );
}

function youValue(measure: ComparisonMeasure, state: PlayerState): { text: string; pct: number } {
  if (measure.you.kind === 'toolsUsed') {
    const n = state.toolsUsedThisMonth;
    return { text: formatInt(n), pct: (n / measure.scaleMax) * 100 };
  }
  const yes = state.completedMissionIds.includes(measure.you.missionId);
  return { text: yes ? 'Yes' : 'Not yet', pct: yes ? 100 : 0 };
}

const formatMeasure = (m: ComparisonMeasure, v: number) => (m.unit === 'percent' ? `${v}%` : String(v));

function Comparison({ state }: { state: PlayerState }) {
  const { name: operator } = useOperator();
  return (
    <section className="box" aria-labelledby="cmp-title">
      <h2 id="cmp-title">You and other players</h2>
      <ul className="legend" aria-label="Key">
        {comparisonSeries.map((s) => (
          <li key={s.key}>
            <i style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
      {comparisonMeasures.map((m) => {
        const you = youValue(m, state);
        const rows = [
          { ...comparisonSeries[0], text: you.text, pct: you.pct },
          { ...comparisonSeries[1], text: formatMeasure(m, m.pilot), pct: (m.pilot / m.scaleMax) * 100 },
          { ...comparisonSeries[2], text: formatMeasure(m, m.everyone), pct: (m.everyone / m.scaleMax) * 100 },
        ];
        return (
          <div className="measure" key={m.id}>
            <h3>{m.label}</h3>
            {rows.map((r) => (
              <div className="cmp-row" key={r.key}>
                <span>{r.label}</span>
                <Bar pct={r.pct} color={r.color} />
                <b>{r.text}</b>
              </div>
            ))}
          </div>
        );
      })}
      <p className="cmp-source">“Everyone else” figures come from {operator}.</p>
    </section>
  );
}

function Together({ goal }: { goal: SharedGoal }) {
  return (
    <section className="box" aria-labelledby="together-title">
      <h2 id="together-title">Together</h2>
      <p className="together-count">
        <b>{formatInt(goal.current)}</b> of {formatInt(goal.target)} safer-play check-ins by pilot players.
      </p>
      <div
        role="progressbar"
        aria-label="Shared goal progress"
        aria-valuemin={0}
        aria-valuemax={goal.target}
        aria-valuenow={goal.current}
      >
        <Bar pct={(goal.current / goal.target) * 100} color="var(--acc)" />
      </div>
      <p className="note">
        At {formatInt(goal.target)} the pilot unlocks a {formatPenceWhole(goal.rewardPence)} donation to a good cause
        players vote for.
      </p>
    </section>
  );
}

