import { howItWorks, type HowItWorksStep } from '../data/howItWorks';

const icons: Record<HowItWorksStep['icon'], { bg: string; fg: string; path: JSX.Element }> = {
  check: {
    bg: 'var(--acc-soft)',
    fg: 'var(--acc)',
    path: <path d="M14 23l5 5 11-12" />,
  },
  pulse: {
    bg: 'var(--blue-soft)',
    fg: 'var(--blue)',
    path: <path d="M12 22h8l3-7 4 14 3-7h4" />,
  },
  heart: {
    bg: 'var(--good-soft)',
    fg: 'var(--good)',
    path: <path d="M22 31s-9-5.5-9-11.5A5 5 0 0122 16a5 5 0 019 3.5C31 25.5 22 31 22 31z" />,
  },
};

export function HowItWorks() {
  return (
    <section className="how" aria-labelledby="how-title">
      <h2 id="how-title" className="how-title">
        How it works
      </h2>
      <ol className="steps">
        {howItWorks.map((step) => {
          const icon = icons[step.icon];
          return (
            <li key={step.title}>
              <svg viewBox="0 0 44 44" aria-hidden="true">
                <rect width="44" height="44" rx="12" fill={icon.bg} />
                <g fill="none" stroke={icon.fg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  {icon.path}
                </g>
              </svg>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
