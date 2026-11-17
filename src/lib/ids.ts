/** A random hex string, used for pseudonymised demo player IDs and event IDs. */
export function randomHex(bytes = 8): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
}
