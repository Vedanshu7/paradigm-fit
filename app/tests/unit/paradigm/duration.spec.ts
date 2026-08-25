/**
 * Unit tests for the duration value object: the accepted grammar, the bounds,
 * and the short-block threshold (REQ-4, REQ-8).
 */
import { describe, expect, it } from 'vitest';

import {
  BLOCK_BOUNDS,
  isAtypicallyShort,
  parseDuration,
  SCAN_BOUNDS,
} from '@/paradigm/domain/duration';

describe('parseDuration', () => {
  /** Whole and fractional seconds are accepted; surrounding whitespace is not an error. */
  it.each([
    ['20', 20],
    ['12.5', 12.5],
    ['1.25', 1.25],
    [' 45 ', 45],
  ])('TC-UT-001 [REQ-4]: accepts %j as a plain decimal', (raw, value) => {
    expect(parseDuration(raw, BLOCK_BOUNDS)).toEqual({ ok: true, value });
  });

  /**
   * Everything `Number()` would happily coerce (exponents, signs, commas,
   * bare dots, Infinity) is refused: the grammar is digits with an optional
   * fraction, nothing else.
   */
  it.each(['abc', '1e3', '-5', '+3', '1,5', '.', '.5', '12.', '1 2', 'Infinity', 'NaN'])(
    'TC-UT-002 [REQ-4]: rejects %j as not-a-number',
    (raw) => {
      expect(parseDuration(raw, BLOCK_BOUNDS)).toEqual({ ok: false, code: 'not-a-number' });
    },
  );

  /** Block bounds are inclusive at both ends, and each rejection carries its own code. */
  it.each([
    ['', { ok: false, code: 'empty' }],
    ['   ', { ok: false, code: 'empty' }],
    ['0.9', { ok: false, code: 'too-small' }],
    ['1', { ok: true, value: 1 }],
    ['12.5', { ok: true, value: 12.5 }],
    ['3600', { ok: true, value: 3600 }],
    ['3600.1', { ok: false, code: 'too-large' }],
  ])('TC-UT-003 [REQ-4]: applies the block bounds to %j', (raw, expected) => {
    expect(parseDuration(raw, BLOCK_BOUNDS)).toEqual(expected);
  });

  /** Scan bounds differ only in the upper limit; the same grammar and codes apply. */
  it.each([
    ['', { ok: false, code: 'empty' }],
    ['0.5', { ok: false, code: 'too-small' }],
    ['1', { ok: true, value: 1 }],
    ['7200', { ok: true, value: 7200 }],
    ['7200.5', { ok: false, code: 'too-large' }],
  ])('TC-UT-004 [REQ-4]: applies the scan bounds to %j', (raw, expected) => {
    expect(parseDuration(raw, SCAN_BOUNDS)).toEqual(expected);
  });
});

describe('isAtypicallyShort', () => {
  /** The threshold is strict: 10 s is typical, anything under it is not. */
  it.each([
    [8, true],
    [9.9, true],
    [10, false],
    [20, false],
  ])('TC-UT-005 [REQ-8]: decides whether %d s is atypically short', (sec, expected) => {
    expect(isAtypicallyShort(sec)).toBe(expected);
  });
});
