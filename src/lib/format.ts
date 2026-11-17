const intFmt = new Intl.NumberFormat('en-GB');
const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
const gbpWhole = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

export const formatInt = (n: number) => intFmt.format(n);

export const formatPence = (pence: number) => gbp.format(pence / 100);

export const formatPenceWhole = (pence: number) => gbpWhole.format(pence / 100);

/** 400 -> "0.4" */
export const formatSeconds = (ms: number) => (ms / 1000).toFixed(1);

/** "7f3a5c0e8d2b91c2" -> "7f3a…91c2" */
export const shortId = (id: string) => (id.length > 9 ? `${id.slice(0, 4)}…${id.slice(-4)}` : id);

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/** -3 -> "−3%", 1 -> "+1%" (true minus sign) */
export const formatSignedPct = (n: number) => `${n < 0 ? '−' : n > 0 ? '+' : ''}${Math.abs(n)}%`;

export const clampPct = (n: number) => Math.max(0, Math.min(100, n));
