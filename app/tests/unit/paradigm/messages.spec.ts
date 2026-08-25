/**
 * Unit tests for the operator-facing wording: rejection reasons, verdict
 * titles and detail sentences (REQ-2, REQ-5). Wording is pinned here so a
 * copy change is a deliberate, reviewed edit.
 */
import { describe, expect, it } from 'vitest';

import { BLOCK_BOUNDS, SCAN_BOUNDS } from '@/paradigm/domain/duration';
import { parseErrorMessage, verdictDetail, verdictTitle } from '@/paradigm/ui/lib/messages';

describe('parseErrorMessage', () => {
  /** Each rejection code gets its own instruction, and range messages carry the actual bound. */
  it.each([
    ['empty', BLOCK_BOUNDS, 'Enter a duration in seconds'],
    ['not-a-number', BLOCK_BOUNDS, 'Enter a plain number of seconds, like 20 or 12.5'],
    ['too-small', BLOCK_BOUNDS, 'Must be at least 1 s'],
    ['too-large', BLOCK_BOUNDS, 'Must be at most 3600 s'],
    ['too-large', SCAN_BOUNDS, 'Must be at most 7200 s'],
  ] as const)(
    'TC-UT-060 [REQ-4] [REQ-5]: gives the %s rejection its own reason',
    (code, bounds, expected) => {
      expect(parseErrorMessage(code, bounds)).toBe(expected);
    },
  );
});

describe('verdictTitle', () => {
  /** The four titles are the four verdict names from REQ-2, nothing else. */
  it('TC-UT-061 [REQ-2]: names each of the four verdicts', () => {
    expect(verdictTitle('fits')).toBe('Fits');
    expect(verdictTitle('underrun')).toBe('Fits, scan time unused');
    expect(verdictTitle('overflow')).toBe('Does not fit');
    expect(verdictTitle('unchecked')).toBe('Cannot check');
  });
});

describe('verdictDetail', () => {
  /** A mismatch states its size in seconds; the operator never subtracts. */
  it('TC-UT-062 [REQ-2]: reports the overrun or unused seconds in the sentence', () => {
    expect(verdictDetail({ kind: 'overflow', overflowSec: 12.5 })).toContain('12.5 s past the end');
    expect(verdictDetail({ kind: 'underrun', idleSec: 160 })).toContain('160 s before the scan');
    expect(verdictDetail({ kind: 'fits' })).toBe('Paradigm matches the scan duration exactly.');
  });

  /** Singular for one bad field, a count for several. */
  it('TC-UT-063 [REQ-5]: counts the invalid fields when the check cannot run', () => {
    expect(verdictDetail({ kind: 'unchecked', invalidFields: ['scan'] })).toContain(
      'One input is invalid',
    );
    expect(verdictDetail({ kind: 'unchecked', invalidFields: ['scan', 'block-2'] })).toContain(
      '2 inputs are invalid',
    );
  });
});
