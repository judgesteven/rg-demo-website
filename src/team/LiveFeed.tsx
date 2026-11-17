import { useEffect, useId, useState } from 'react';
import { backend, type EventName, type RewardsEvent } from '../backend';
import { FEED_LENGTH, simulateOptions } from '../data/events';
import { demoPlayer } from '../data/player';
import { randomHex } from '../lib/ids';
import { formatTime, shortId } from '../lib/format';

/** `changeText` describes what the latest update changed on the page. */
export function LiveFeed({ changeText }: { changeText: string | null }) {
  const [events, setEvents] = useState<RewardsEvent[]>([]);
  const [choice, setChoice] = useState<EventName>(simulateOptions[0].event);
  const [busy, setBusy] = useState(false);
  const selectId = useId();

  useEffect(() => {
    let live = true;
    const load = () => backend.getRecentEvents(FEED_LENGTH).then((e) => live && setEvents(e));
    load();
    const off = backend.subscribeToEvents(load);
    return () => {
      live = false;
      off();
    };
  }, []);

  async function simulate() {
    if (busy) return;
    setBusy(true);
    try {
      // A new pseudonymised pilot player performs the chosen action.
      await backend.sendEvent(randomHex(8), choice);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel side" aria-labelledby="feed-title">
      <div className="panel-head">
        <h2 id="feed-title">Live events</h2>
        <span className="live">
          <i aria-hidden="true" />
          Live
        </span>
      </div>

      <div className="simulate">
        <label htmlFor={selectId}>Simulate a player action</label>
        <div className="simulate-row">
          <select id={selectId} value={choice} onChange={(e) => setChoice(e.target.value as EventName)}>
            {simulateOptions.map((o) => (
              <option key={o.event} value={o.event}>
                {o.label}
              </option>
            ))}
          </select>
          <button type="button" className="btn" onClick={simulate} aria-disabled={busy || undefined}>
            {busy ? 'Sending…' : 'Simulate'}
          </button>
        </div>
        <p className="simulate-result" role="status">
          {changeText ?? 'Updates the figures on this page.'}
        </p>
      </div>

      <ol className="feed">
        {events.map((e) => (
          <li key={e.id} className={e.playerId === demoPlayer.id ? 'ev is-demo' : 'ev'}>
            <code>{e.name}</code>
            <span>
              <time dateTime={e.occurredAt}>{formatTime(e.occurredAt)}</time> · Player {shortId(e.playerId)}
              {e.playerId === demoPlayer.id && ' (player app)'}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
