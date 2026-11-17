import { clampPct } from '../lib/format';

/** A horizontal bar whose fill animates to its new width. Decorative: pair it with a visible value. */
export function Bar({ pct, color, onDark = false }: { pct: number; color: string; onDark?: boolean }) {
  return (
    <span className={onDark ? 'track track-dark' : 'track'} aria-hidden="true">
      <span className="fill" style={{ width: `${clampPct(pct)}%`, background: color }} />
    </span>
  );
}
