import { useEffect, useId, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useOperator } from '../state/OperatorContext';
import { DEFAULT_OPERATOR, OPERATOR_MAX_LENGTH } from '../data/operator';
import { OperatorMark } from './OperatorMark';

export function TopBar() {
  return (
    <header className="topbar">
      <div className="brand">
        <b>Safer Play Rewards</b>
        <span className="byline">
          Pilot concept by
          <img src="/gamelayer-g.png" alt="" width="18" height="18" />
          GameLayer
        </span>
      </div>
      <nav className="tabs" aria-label="Views">
        <NavLink to="/player">Player app</NavLink>
        <NavLink to="/team">Team dashboard</NavLink>
      </nav>
      <OperatorBrand />
    </header>
  );
}

/** The lottery's branding slot: logo (or placeholder) and name, editable for each demo. */
function OperatorBrand() {
  const { name, input, setInput, logo, setLogoFromFile, clearLogo } = useOperator();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const nameField = useRef<HTMLInputElement>(null);
  const fileField = useRef<HTMLInputElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    nameField.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setError(null);
      await setLogoFromFile(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'That file could not be used.');
    }
  }

  return (
    <div className="op-brand" ref={wrap}>
      <button
        ref={trigger}
        type="button"
        className="op-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        <OperatorMark />
        <span className="op-name">{name}</span>
        <span className="visually-hidden">: edit lottery branding</span>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className="op-edit">
          <path d="M10.5 2.5l3 3L6 13H3v-3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="op-panel" id={panelId} role="group" aria-label="Lottery branding">
          <label className="field">
            <span>Lottery name</span>
            <input
              ref={nameField}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={DEFAULT_OPERATOR}
              maxLength={OPERATOR_MAX_LENGTH}
              autoComplete="off"
              spellCheck={false}
            />
          </label>

          <div className="field">
            <span>Logo</span>
            <div className="op-logo-row">
              <OperatorMark size={44} />
              <button type="button" className="btn btn-quiet" onClick={() => fileField.current?.click()}>
                {logo ? 'Replace logo' : 'Upload logo'}
              </button>
              {logo && (
                <button type="button" className="btn btn-quiet" onClick={clearLogo}>
                  Remove
                </button>
              )}
            </div>
            <input ref={fileField} type="file" accept="image/*" hidden onChange={onFile} />
            {error && <p className="field-error" role="alert">{error}</p>}
          </div>

          <p className="note">Shows in the header and the player app. Saved in this browser only.</p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setOpen(false);
              trigger.current?.focus();
            }}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
