import type { Mission } from '../backend';
import { missionArt } from '../data/missions';
import { iconPaths } from '../components/icons';

/**
 * The image area at the top of a mission card. Shows the mission's photo when
 * one is set, otherwise placeholder artwork in the colour of where the mission
 * happens (coral: on this page, cobalt: in the account, green: out and about).
 */
export function MissionMedia({ mission }: { mission: Mission }) {
  if (mission.image) {
    return (
      <div className="mission-media">
        <img src={mission.image.src} alt={mission.image.alt} loading="lazy" />
      </div>
    );
  }
  const icon = iconPaths[missionArt[mission.id] ?? 'star'];
  return (
    <div className={`mission-media art-${mission.where}`} aria-hidden="true">
      <svg viewBox="0 0 340 136" preserveAspectRatio="xMidYMid slice">
        <rect width="340" height="136" className="art-bg" />
        <circle cx="300" cy="18" r="74" className="art-shape" />
        <circle cx="34" cy="128" r="40" className="art-shape" />
        <circle cx="238" cy="108" r="14" className="art-ring" />
        <circle cx="92" cy="30" r="6" className="art-dot" />
        <circle cx="170" cy="68" r="42" className="art-disc" />
        <g transform="translate(141.2 39.2) scale(2.4)">
          <path d={icon} className="art-icon" />
        </g>
      </svg>
    </div>
  );
}
