/**
 * Unit tests for the verdict domain service: which of the three computed
 * outcomes a total earns against a scan (REQ-2).
 */
import { describe, expect, it } from 'vitest';

import { FIT_TOLERANCE_SEC } from '@/paradigm/domain/paradigm';
import { computeVerdict } from '@/paradigm/domain/verdict';

describe('computeVerdict', () => {
  /**
   * `0.1 + 0.2` is not `0.3` in binary floating point; the tolerance (DD-1)
   * is what lets a paradigm of decimal blocks still fit its scan exactly.
   */
  it('TC-UT-020 [REQ-2]: fits on exact match and within the float tolerance', () => {
    expect(computeVerdict(140, 140)).toEqual({ kind: 'fits' });
    expect(computeVerdict(0.1 + 0.2, 0.3)).toEqual({ kind: 'fits' });
    expect(computeVerdict(0, 0)).toEqual({ kind: 'fits' });
  });

  /** The tolerance is a strict bound: half of it fits, exactly it does not. */
  it('TC-UT-023 [REQ-2]: the fit tolerance is 1e-9 s, exclusive', () => {
    expect(FIT_TOLERANCE_SEC).toBe(1e-9);
    expect(computeVerdict(5e-10, 0)).toEqual({ kind: 'fits' });
    expect(computeVerdict(1e-9, 0).kind).toBe('overflow');
    expect(computeVerdict(0, 1e-9).kind).toBe('underrun');
    expect(computeVerdict(140.001, 140).kind).toBe('overflow');
  });

  /** The failure case: the amount past the scan end is reported in seconds. */
  it('TC-UT-021 [REQ-2]: overflow when the paradigm is longer, reporting the excess', () => {
    expect(computeVerdict(150, 140)).toEqual({ kind: 'overflow', overflowSec: 10 });
    expect(computeVerdict(68.5, 60)).toEqual({ kind: 'overflow', overflowSec: 8.5 });
  });

  /** The acceptable case: unused scan time is reported, not treated as an error. */
  it('TC-UT-022 [REQ-2]: underrun when the paradigm is shorter, reporting the unused time', () => {
    expect(computeVerdict(140, 300)).toEqual({ kind: 'underrun', idleSec: 160 });
    expect(computeVerdict(0, 120)).toEqual({ kind: 'underrun', idleSec: 120 });
  });
});
