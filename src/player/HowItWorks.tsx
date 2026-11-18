import { howItWorks, type HowItWorksStep } from '../data/howItWorks';

const icons: Record<HowItWorksStep['icon'], { bg: string; fg: string; path: JSX.Element }> = {
  rocket: {
    bg: 'var(--acc-soft)',
    fg: 'var(--acc)',
    path: (
      <>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </>
    ),
  },
  code: {
    bg: 'var(--blue-soft)',
    fg: 'var(--blue)',
    path: (
      <>
        <path d="M16 18l6-6-6-6" />
        <path d="M8 6l-6 6 6 6" />      </>
    ),
  },
  gift: {
    bg: 'var(--good-soft)',
    fg: 'var(--good)',
    path: (
      <>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13" />
        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
      </>
    ),
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
                <g transform="translate(10 10)" fill="none" stroke={icon.fg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
