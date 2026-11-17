import { useOperator } from '../state/OperatorContext';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

/** The operator's logo, or a dashed placeholder with their initials until one is added. */
export function OperatorMark({ size = 36 }: { size?: number }) {
  const { name, logo } = useOperator();
  return logo ? (
    <img className="op-mark op-mark-logo" src={logo} alt="" width={size} height={size} />
  ) : (
    <span
      className="op-mark op-mark-placeholder"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
