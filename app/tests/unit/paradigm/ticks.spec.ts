/**
 * Unit tests for the ruler's tick helper (REQ-6): the step chosen for a
 * scale, and the cap on how many ticks are drawn.
 */
import { describe, expect, it } from 'vitest';

import { computeTicks, MAX_TICKS } from '@/paradigm/ui/lib/ticks';

describe('computeTicks', () => {
  /**
   * Each scale picks the smallest step from the table that keeps the count
   * near the target, so the axis gets coarser as the scan gets longer.
   */
  it.each([
    [48, 5, 10],
    [140, 10, 15],
    [300, 15, 21],
    [1000, 60, 17],
    [7200, 600, 13],
  ])(
    'TC-UT-030 [REQ-6]: scale %d s steps by %d s so the tick count lands near the target',
    (scale, step, count) => {
      const ticks = computeTicks(scale);
      expect(ticks[1]).toBe(step);
      expect(ticks.length).toBe(count);
      expect(ticks[0]).toBe(0);
    },
  );

  /** Whatever scale arrives, the renderer is never asked to draw unbounded ticks. */
  it('TC-UT-032 [REQ-6]: tick count is hard-capped even for out-of-bounds scales', () => {
    expect(computeTicks(1_000_000_000).length).toBeLessThanOrEqual(MAX_TICKS);
    expect(computeTicks(Number.MAX_SAFE_INTEGER).length).toBeLessThanOrEqual(MAX_TICKS);
  });

  /** Monotonic: a longer scan never gets a finer step than a shorter one. */
  it('TC-UT-033 [REQ-6]: a longer scan gets a coarser axis', () => {
    expect(computeTicks(1200)[1]).toBeGreaterThan(computeTicks(120)[1]);
  });
});
