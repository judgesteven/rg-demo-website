import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_OPERATOR,
  OPERATOR_LOGO_MAX_PX,
  OPERATOR_LOGO_STORAGE_KEY,
  OPERATOR_MAX_LENGTH,
  OPERATOR_QUERY_PARAM,
  OPERATOR_STORAGE_KEY,
} from '../data/operator';

interface OperatorValue {
  /** What is typed in the name field (may be empty while editing). */
  input: string;
  setInput: (value: string) => void;
  /** The name to display: the input, or the default when empty. */
  name: string;
  /** The operator's logo as a data URL, or null to show the placeholder. */
  logo: string | null;
  setLogoFromFile: (file: File) => Promise<void>;
  clearLogo: () => void;
}

const OperatorContext = createContext<OperatorValue | null>(null);

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage unavailable or full: the value still works for this visit */
  }
}

function initialOperator(): string {
  const fromUrl = new URLSearchParams(window.location.search).get(OPERATOR_QUERY_PARAM)?.trim();
  if (fromUrl) return fromUrl.slice(0, OPERATOR_MAX_LENGTH);
  return read(OPERATOR_STORAGE_KEY) ?? DEFAULT_OPERATOR;
}

/** Shrinks an uploaded logo so it stays small enough for localStorage. */
function fileToLogo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth || OPERATOR_LOGO_MAX_PX;
      const h = img.naturalHeight || OPERATOR_LOGO_MAX_PX;
      const scale = Math.min(1, OPERATOR_LOGO_MAX_PX / Math.max(w, h));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That file could not be read as an image.'));
    };
    img.src = url;
  });
}

export function OperatorProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState(initialOperator);
  const [logo, setLogo] = useState<string | null>(() => read(OPERATOR_LOGO_STORAGE_KEY));
  const name = input.trim() || DEFAULT_OPERATOR;

  useEffect(() => write(OPERATOR_STORAGE_KEY, name), [name]);
  useEffect(() => write(OPERATOR_LOGO_STORAGE_KEY, logo), [logo]);

  const value = useMemo<OperatorValue>(
    () => ({
      input,
      setInput,
      name,
      logo,
      setLogoFromFile: async (file) => setLogo(await fileToLogo(file)),
      clearLogo: () => setLogo(null),
    }),
    [input, name, logo],
  );
  return <OperatorContext.Provider value={value}>{children}</OperatorContext.Provider>;
}

export function useOperator(): OperatorValue {
  const ctx = useContext(OperatorContext);
  if (!ctx) throw new Error('useOperator must be used inside OperatorProvider');
  return ctx;
}
