import { useCallback, useEffect, useRef, useState } from 'react';
import { PhoneFrame } from './PhoneFrame';
import { PlayerApp } from './PlayerApp';
import { HowItWorks } from './HowItWorks';
import { playerIntro } from '../data/howItWorks';
import { TOAST_MS } from '../data/player';

export function PlayerPage() {
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const timer = useRef<number>();

  const showToast = useCallback((text: string) => {
    setToast({ id: Date.now(), text });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <section className="band player-page">
      <div className="wrap player-layout">
        <div className="intro">
          <h1>{playerIntro.title}</h1>
          <p className="lede">{playerIntro.body}</p>        </div>

        <div className="phone-slot">
          <PhoneFrame
            overlay={
              <div className="toast-region" role="status" aria-live="polite">
                {toast && (
                  <div className="toast" key={toast.id}>
                    {toast.text}
                  </div>
                )}
              </div>
            }
          >
            <PlayerApp onToast={showToast} />
          </PhoneFrame>
        </div>

        <HowItWorks />
      </div>
    </section>
  );
}
