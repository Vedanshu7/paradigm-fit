/**
 * Formats a time value for display with at most two decimals.
 *
 * Durations may be non-integer seconds, so sums accumulate float noise
 * (`0.1 + 0.2`); rounding at the display boundary keeps that noise out of
 * every rendered number without touching the underlying values. A non-zero
 * value that would round to zero reads `< 0.01`, so a mismatch is never
 * displayed as `0`.
 *
 * @param value - time in seconds
 * @returns the value rounded to two decimals, without trailing zeros
 *
 * @requirement REQ-3
 */
export function formatSec(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const formatted = rounded === 0 && value !== 0 ? '< 0.01' : rounded.toString();
  return formatted;
}
