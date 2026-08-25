/** First violated validation rule for a duration input string. */
export type ParseErrorCode = 'empty' | 'not-a-number' | 'too-small' | 'too-large';

/** Result of parsing a raw duration string: a value in seconds, or an error code. */
export type ParseResult = { ok: true; value: number } | { ok: false; code: ParseErrorCode };

/** Inclusive duration limits in seconds. */
export interface Bounds {
  min: number;
  max: number;
}

/**
 * Lower edge of the clinically typical block duration range (10-20 s).
 *
 * @requirement REQ-8
 */
const TYPICAL_MIN_BLOCK_SEC = 10;

/**
 * Accepted block duration range in seconds: `1 <= d <= 3600`.
 *
 * @requirement REQ-4
 */
export const BLOCK_BOUNDS: Bounds = { min: 1, max: 3600 };

/**
 * Accepted scan duration range in seconds: `1 <= s <= 7200`.
 *
 * @requirement REQ-4
 */
export const SCAN_BOUNDS: Bounds = { min: 1, max: 7200 };

const NUMBER_RE = /^\d+(\.\d+)?$/;

/**
 * Parses an operator-entered duration string against the accepted grammar and bounds.
 *
 * Apart from trimming whitespace, the string is never altered or coerced: any
 * deviation is returned as a typed error code, and the caller decides how to
 * surface it.
 *
 * @param raw - the string exactly as the operator entered it
 * @param bounds - inclusive limits in seconds
 * @returns the parsed value in seconds, or the first violated rule as an error code
 *
 * @requirement REQ-4
 */
export function parseDuration(raw: string, bounds: Bounds): ParseResult {
  const trimmed = raw.trim();
  let result: ParseResult;
  if (trimmed === '') {
    result = { ok: false, code: 'empty' };
  } else if (!NUMBER_RE.test(trimmed)) {
    result = { ok: false, code: 'not-a-number' };
  } else {
    const value = Number(trimmed);
    if (value < bounds.min) {
      result = { ok: false, code: 'too-small' };
    } else if (value > bounds.max) {
      result = { ok: false, code: 'too-large' };
    } else {
      result = { ok: true, value };
    }
  }
  return result;
}

/**
 * Whether a valid block duration is shorter than the clinically typical range
 * (10-20 s; the haemodynamic response takes seconds to build).
 *
 * @param durationSec - a validated block duration in seconds
 * @returns true when the block deserves the non-blocking "shorter than typical" hint
 *
 * @requirement REQ-8
 */
export function isAtypicallyShort(durationSec: number): boolean {
  const isShort = durationSec < TYPICAL_MIN_BLOCK_SEC;
  return isShort;
}
