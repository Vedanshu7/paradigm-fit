/**
 * Unit tests for the paradigm aggregate's arithmetic: totals and per-block
 * placement against the scan window (REQ-1).
 */
import { describe, expect, it } from 'vitest';

import { computeTimings, totalDurationSec } from '@/paradigm/domain/paradigm';

describe('totalDurationSec', () => {
  /** The empty paradigm totals zero; decimal sums carry float noise, which the callers tolerate. */
  it('TC-UT-010 [REQ-1]: sums block durations, including decimals and the empty list', () => {
    expect(totalDurationSec([])).toBe(0);
    expect(totalDurationSec([20, 20, 30])).toBe(70);
    expect(totalDurationSec([12.5, 15.5])).toBe(28);
    expect(totalDurationSec([0.1, 0.2])).toBeCloseTo(0.3, 9);
  });
});

describe('computeTimings', () => {
  /** Blocks are laid end to end from zero; each starts where the previous one ended. */
  it('TC-UT-011 [REQ-1]: start is the sum of predecessors, end is start plus duration', () => {
    const timings = computeTimings([12.5, 15.5, 12.5], 100);
    expect(timings.map((t) => [t.startSec, t.endSec])).toEqual([
      [0, 12.5],
      [12.5, 28],
      [28, 40.5],
    ]);
  });

  /**
   * Three placements of the scan end: after every block, through a block,
   * and inside the first block. In all of them recorded plus unrecorded
   * equals the block's duration, which is what the timeline and table rely on.
   */
  it('TC-UT-012 [REQ-1]: recorded is clamped to the scan end, unrecorded is the remainder', () => {
    const fullFit = computeTimings([20, 20], 40);
    expect(fullFit.map((t) => t.unrecordedSec)).toEqual([0, 0]);

    const midCut = computeTimings([20, 20, 20], 50);
    expect(midCut.map((t) => t.recordedSec)).toEqual([20, 20, 10]);
    expect(midCut.map((t) => t.unrecordedSec)).toEqual([0, 0, 10]);

    const fullyLost = computeTimings([20, 20], 10);
    expect(fullyLost.map((t) => t.recordedSec)).toEqual([10, 0]);
    expect(fullyLost.map((t) => t.unrecordedSec)).toEqual([10, 20]);

    for (const t of [...fullFit, ...midCut, ...fullyLost]) {
      expect(t.recordedSec + t.unrecordedSec).toBeCloseTo(t.endSec - t.startSec, 9);
    }
  });

  /**
   * With decimals the running sum drifts by ~1e-15, so `duration - recorded`
   * is not exactly zero for a block that fits. It must still read as fully
   * recorded, or the table and timeline would mark a fitting block as cut.
   */
  it('TC-UT-013 [REQ-1]: float noise in the running sum never yields an unrecorded remainder', () => {
    const timings = computeTimings([17.23, 20.29, 24.3], 100);
    expect(timings.map((t) => t.unrecordedSec)).toEqual([0, 0, 0]);
    expect(timings.map((t) => t.recordedSec)).toEqual([17.23, 20.29, 24.3]);
  });
});
