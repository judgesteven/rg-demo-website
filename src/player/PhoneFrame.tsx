import { useEffect, useState, type ReactNode } from 'react';

/** Real phone proportions: a 390 × 844 screen inside a 12px bezel. */
const DEVICE_W = 414;
const DEVICE_H = 868;
/** Space kept above and below the phone when fitting it to the window. */
const FIT_MARGIN = 170;
/** Never shrink below this, so text stays readable; the page scrolls instead. */
const MIN_SCALE = 0.72;
const FRAMED_QUERY = '(min-width: 601px)';

/** Scale the whole phone evenly so it fits the window height without distorting. */
function usePhoneScale(): number | null {
  const [scale, setScale] = useState<number | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(FRAMED_QUERY);
    const update = () => {
      if (!mq.matches) return setScale(null);
      const fit = (window.innerHeight - FIT_MARGIN) / DEVICE_H;
      setScale(Math.min(1, Math.max(MIN_SCALE, fit)));
    };
    update();
    window.addEventListener('resize', update);
    mq.addEventListener('change', update);
    return () => {
      window.removeEventListener('resize', update);
      mq.removeEventListener('change', update);
    };
  }, []);
  return scale;
}

/**
 * A realistic phone around the app on desktop and tablet. On phones (≤600px)
 * CSS removes the frame and the app fills the screen.
 */
export function PhoneFrame({ children, overlay }: { children: ReactNode; overlay?: ReactNode }) {
  const scale = usePhoneScale();
  const fitted = scale !== null && scale < 1;
  return (
    <div
      className="device-fit"
      style={fitted ? { width: DEVICE_W * scale, height: DEVICE_H * scale } : undefined}
    >
      <div
        className="device"
        style={fitted ? { transform: `scale(${scale})`, transformOrigin: 'top left' } : undefined}
      >
        <div className="screen">
          <div className="statusbar" aria-hidden="true">
            <span>9:41</span>
            <span className="island" />
            <span className="status-icons">
              <svg width="18" height="12" viewBox="0 0 18 12">
                <rect x="0" y="8" width="3" height="4" rx="0.5" fill="currentColor" />
                <rect x="5" y="5" width="3" height="7" rx="0.5" fill="currentColor" />
                <rect x="10" y="2" width="3" height="10" rx="0.5" fill="currentColor" />
                <rect x="15" y="0" width="3" height="12" rx="0.5" fill="currentColor" />
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12">
                <path d="M8 11.5l2.4-2.9a3.6 3.6 0 00-4.8 0z" fill="currentColor" />
                <path d="M3.6 6.3a6.6 6.6 0 018.8 0l-1.3 1.6a4.6 4.6 0 00-6.2 0z" fill="currentColor" />
                <path d="M1 3.2a10.6 10.6 0 0114 0l-1.3 1.6a8.6 8.6 0 00-11.4 0z" fill="currentColor" />
              </svg>
              <svg width="27" height="12" viewBox="0 0 27 12">
                <rect x="0.5" y="0.5" width="23" height="11" rx="3.5" fill="none" stroke="currentColor" opacity="0.45" />
                <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" />
                <rect x="24.5" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.45" />
              </svg>
            </span>
          </div>
          <div className="screen-scroll">{children}</div>
          <div className="home-indicator" aria-hidden="true" />
          {overlay}
        </div>
      </div>
    </div>
  );
}
