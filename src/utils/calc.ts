/**
 * Triathlon calculator — time parsing & formatting utilities.
 */

/** Parse a time string into total seconds. */
export function parseTime(str: string): number {
  if (!str.trim()) return 0;
  // Already formatted: mm:ss or hh:mm:ss
  if (str.includes(':')) {
    const p = str.split(':').map(Number);
    if (p.length === 2) return p[0] * 60 + p[1];
    if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2];
    return 0;
  }
  // Dot/comma: m.ss → mm:ss
  if (str.includes('.') || str.includes(',')) {
    const p = str.split(/[.,]/).map(Number);
    if (p.length === 2) return p[0] * 60 + p[1];
    if (p.length === 3) return p[0] * 3600 + p[1] * 60 + p[2];
    return 0;
  }
  // Raw number: 655 → 6:55, 130 → 1:30, 13000 → 1:30:00
  const n = parseInt(str, 10);
  if (n >= 100000) {
    const h = Math.floor(n / 10000);
    const m = Math.floor((n % 10000) / 100);
    return h * 3600 + m * 60 + (n % 100);
  }
  if (n >= 100) {
    const m = Math.floor(n / 100);
    return m * 60 + (n % 100);
  }
  return n; // bare seconds
}

/** Format total seconds as h:mm:ss. */
export function formatTime(sec: number): string {
  if (sec <= 0 || isNaN(sec)) return '0:00:00';
  const h = Math.floor(sec / 3600),
    m = Math.floor((sec % 3600) / 60),
    s = Math.floor(sec % 60);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Format pace as mm:ss per unit. */
export function paceStr(sec: number, units: number): string {
  if (sec <= 0 || units <= 0) return '';
  const v = sec / units;
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(Math.floor(v % 60)).padStart(2, '0')}`;
}
