import type { Chapter, PlayerState } from '../backend';
import { badges, type BadgeDef, type BadgeIcon } from '../data/badges';
import { formatInt } from '../lib/format';
import { iconPaths } from '../components/icons';

export type BadgeStatus = 'earned' | 'unlocked' | 'locked';

export interface BadgeView {
  def: BadgeDef;
  status: BadgeStatus;
  /** 0–1, for the progress ring on unlocked badges. */
  progress: number;
  /** Short status line under the badge name. */
  detail: string;
}

/** Works out each badge's state from the player's progress. */
export function evaluateBadges(chapters: Chapter[], state: PlayerState): BadgeView[] {
  const done = new Set(state.completedMissionIds);
  const chapterOfMission = (id: string) => chapters.find((c) => c.missions.some((m) => m.id === id));
  const isOpen = (c: Chapter | undefined) => !!c && c.unlockWeek <= state.currentWeek;

  return badges.map((def): BadgeView => {
    const rule = def.rule;
    if (rule.kind === 'chapter') {
      const ch = chapters.find((c) => c.id === rule.chapterId);
      const total = ch?.missions.length ?? 0;
      const n = ch?.missions.filter((m) => done.has(m.id)).length ?? 0;
      if (total > 0 && n === total) return { def, status: 'earned', progress: 1, detail: 'Earned' };
      if (!isOpen(ch)) return { def, status: 'locked', progress: 0, detail: `From week ${ch?.unlockWeek}` };
      return { def, status: 'unlocked', progress: n / total, detail: `${n} of ${total} missions` };
    }
    if (rule.kind === 'mission') {
      if (done.has(rule.missionId)) return { def, status: 'earned', progress: 1, detail: 'Earned' };
      const ch = chapterOfMission(rule.missionId);
      if (!isOpen(ch)) return { def, status: 'locked', progress: 0, detail: `From week ${ch?.unlockWeek}` };
      return { def, status: 'unlocked', progress: 0, detail: 'Ready to start' };
    }
    if (state.points >= rule.points) return { def, status: 'earned', progress: 1, detail: 'Earned' };
    return {
      def,
      status: 'unlocked',
      progress: state.points / rule.points,
      detail: `${formatInt(state.points)} of ${formatInt(rule.points)} pts`,
    };
  });
}


const R = 29;
const CIRC = 2 * Math.PI * R;

/** A 64px medallion: solid coral when earned, a progress ring when unlocked, dashed and padlocked when locked. */
function Medallion({ icon, status, progress }: { icon: BadgeIcon; status: BadgeStatus; progress: number }) {
  return (
    <svg className={`medal medal-${status}`} viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
      {status === 'earned' && (
        <>
          <circle cx="32" cy="32" r="31" className="medal-fill" />
          <circle cx="32" cy="32" r="25.5" className="medal-inner" />
        </>
      )}
      {status === 'unlocked' && (
        <>
          <circle cx="32" cy="32" r={R} className="medal-track" />
          {progress > 0 && (
            <circle
              cx="32"
              cy="32"
              r={R}
              className="medal-progress"
              strokeDasharray={`${CIRC * progress} ${CIRC}`}
              transform="rotate(-90 32 32)"
            />
          )}
        </>
      )}
      {status === 'locked' && <circle cx="32" cy="32" r="30" className="medal-dashed" />}
      <g transform="translate(17.6 17.6) scale(1.2)" className="medal-icon">
        <path d={iconPaths[icon]} />
      </g>
      {status === 'locked' && (
        <g className="medal-lock" transform="translate(42 42)">
          <circle cx="10" cy="10" r="9.5" />
          <path d="M6.5 9.5h7v5.5h-7z M8 9.5V7.8a2 2 0 014 0v1.7" />
        </g>
      )}
    </svg>
  );
}

export function Badges({ views }: { views: BadgeView[] }) {
  const earned = views.filter((v) => v.status === 'earned').length;
  return (
    <section className="box badges-box" aria-labelledby="badges-title">
      <div className="badges-head">
        <h2 id="badges-title">Badges</h2>
        <span>
          {earned} of {views.length} earned
        </span>
      </div>
      <ul className="badge-grid">
        {views.map((v) => (
          <li key={v.def.id} className={`badge badge-${v.status}`}>
            <Medallion icon={v.def.icon} status={v.status} progress={v.progress} />
            <b>{v.def.name}</b>
            <span>
              {v.status === 'locked' && <span className="visually-hidden">Locked. </span>}
              {v.detail}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
