import { useEffect, useId, useRef, useState } from 'react';
import type { Chapter, Mission, MissionWhere, PlayerState } from '../backend';
import { MissionMedia } from './MissionMedia';

/** Spoken hint for buttons that take the player somewhere else. */
const destinationHint = (where: MissionWhere, operator: string) =>
  where === 'account' ? `, opens in ${operator}` : where === 'place' ? ', check in on location' : '';

const weeksLabel = ([a, b]: [number, number]) => `Weeks ${a}–${b}`;

/** Focus target after a mission completes: the mission's row, or its chapter if that just finished. */
export const chapterFocusId = (chapterId: string) => `chapter:${chapterId}`;

const Tick = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Padlock = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <path d="M4 7.5h8v6.5H4z M5.8 7.5V5.5a2.2 2.2 0 014.4 0v2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

interface ChapterSectionProps {
  chapter: Chapter;
  state: PlayerState;
  operator: string;
  pending: string | null;
  focusId: string | null;
  onComplete: (m: Mission) => void;
}

/**
 * One chapter of missions, in one of three layouts:
 * - locked: a compact preview of what's coming
 * - finished: a one-line summary that expands to show the completed missions
 * - open: full cards for missions to do, one-line rows for missions done
 */
export function ChapterSection({ chapter, state, operator, pending, focusId, onComplete }: ChapterSectionProps) {
  const done = new Set(state.completedMissionIds);
  const doneCount = chapter.missions.filter((m) => done.has(m.id)).length;
  const total = chapter.missions.length;
  const title = `Chapter ${chapter.number}: ${chapter.name}`;

  if (chapter.unlockWeek > state.currentWeek && doneCount === 0) {
    return <LockedChapter chapter={chapter} title={title} />;
  }
  if (doneCount === total) {
    return <FinishedChapter chapter={chapter} title={title} autoFocus={focusId === chapterFocusId(chapter.id)} />;
  }
  return (
    <section className="chapter" aria-labelledby={`${chapter.id}-title`}>
      <div className="chapter-head">
        <h2 id={`${chapter.id}-title`}>{title}</h2>
        <span>
          {doneCount} of {total} done
        </span>
      </div>
      {chapter.missions.map((m) =>
        done.has(m.id) ? (
          <DoneRow key={m.id} mission={m} autoFocus={focusId === m.id} />
        ) : (
          <MissionCard
            key={m.id}
            mission={m}
            destination={destinationHint(m.where, operator)}
            pending={pending === m.id}
            busy={pending !== null}
            onComplete={() => onComplete(m)}
          />
        ),
      )}
    </section>
  );
}

function LockedChapter({ chapter, title }: { chapter: Chapter; title: string }) {
  return (
    <section className="chapter chapter-locked" aria-labelledby={`${chapter.id}-title`}>
      <div className="chapter-head">
        <h2 id={`${chapter.id}-title`}>{title}</h2>
        <span>{weeksLabel(chapter.weeks)}</span>
      </div>
      <div className="locked-block">
        <p className="locked-note">
          <Padlock />
          Opens in week {chapter.unlockWeek}
        </p>
        <ul>
          {chapter.missions.map((m) => (
            <li key={m.id}>
              <span>{m.title}</span>
              <span className="mission-pts-muted">+{m.points} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FinishedChapter({ chapter, title, autoFocus }: { chapter: Chapter; title: string; autoFocus: boolean }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();
  useEffect(() => {
    if (autoFocus) button.current?.focus();
  }, [autoFocus]);

  return (
    <section className="chapter chapter-finished">
      <h2>
        <button
          ref={button}
          type="button"
          className="chapter-toggle"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="chapter-tick">
            <Tick size={18} />
          </span>
          <span className="chapter-toggle-text">
            <b>{title}</b>
            <small>
              {chapter.missions.length} of {chapter.missions.length} done · {chapter.badge} badge earned
            </small>
          </span>
          <svg className="chevron" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </h2>
      <div id={listId} hidden={!open} className="chapter-rows">
        {chapter.missions.map((m) => (
          <DoneRow key={m.id} mission={m} autoFocus={false} />
        ))}
      </div>
    </section>
  );
}

/** A completed mission, collapsed to one row. */
function DoneRow({ mission, autoFocus }: { mission: Mission; autoFocus: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);
  return (
    <div className="mission-row" ref={ref} tabIndex={-1}>
      <span className="mission-row-tick">
        <Tick />
      </span>
      <span className="mission-row-title">
        {mission.title}
        <span className="visually-hidden">, completed</span>
      </span>
      <span className="mission-pts-muted">+{mission.points} pts</span>
    </div>
  );
}

interface MissionCardProps {
  mission: Mission;
  destination: string;
  pending: boolean;
  busy: boolean;
  onComplete: () => void;
}

/** A mission still to do: image, description and one action button. */
function MissionCard({ mission, destination, pending, busy, onComplete }: MissionCardProps) {
  return (
    <article className="mission">
      <MissionMedia mission={mission} />
      <div className="mission-body">
        <div className="mission-title">
          <h3>{mission.title}</h3>
          <span className="mission-pts">+{mission.points} pts</span>
        </div>
        <p>{mission.description}</p>
        <div className="mission-foot">
          <button
            type="button"
            className="btn"
            onClick={onComplete}
            aria-disabled={busy || undefined}
            aria-label={`${mission.cta}: ${mission.title}${destination}`}
          >
            {pending ? 'Confirming…' : mission.cta}
            {!pending && (
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path
                  d={mission.where === 'account' ? 'M6 3.5h6.5V10 M12.5 3.5L4 12' : 'M3 8h10 M9 4l4 4-4 4'}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
