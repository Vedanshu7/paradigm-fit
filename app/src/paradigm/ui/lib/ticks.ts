/**
 * Candidate ruler tick steps in seconds, ascending. A table rather than a
 * "nice numbers" rounding because a time axis reads in 30 s and 5 min steps,
 * not 50 s and 200 s; the same approach d3-time takes for its tick intervals.
 */
const TICK_STEPS_SEC = [5, 10, 15, 20, 30, 60, 120, 300, 600];

/**
 * How many steps the ruler aims to draw across the track (one more tick than
 * steps, since 0 is a tick). The step chosen is the smallest candidate that
 * yields at most this many, so a longer scan gets a coarser axis rather than a
 * denser one.
 */
const TARGET_TICK_COUNT = 20;

/** Hard cap on rendered ticks, so no scale can make the renderer draw unbounded work. */
export const MAX_TICKS = 60;

/**
 * Produces the ruler tick positions for a timeline scale.
 *
 * The step is the smallest candidate in {@link TICK_STEPS_SEC} that keeps the
 * number of steps at or under `targetCount`, or the coarsest candidate when
 * none does; the tick count is then capped at {@link MAX_TICKS}.
 *
 * @param scaleSec - timeline scale in seconds, `max(total, scan, 1)`
 * @param targetCount - steps to aim for across the track
 * @returns ascending tick positions in seconds, starting at 0
 *
 * @requirement REQ-6
 */
export function computeTicks(scaleSec: number, targetCount = TARGET_TICK_COUNT): number[] {
  const idealStepSec = Math.max(scaleSec, 1) / targetCount;
  const step = TICK_STEPS_SEC.find((s) => s >= idealStepSec) ?? Math.max(...TICK_STEPS_SEC);
  const count = Math.min(Math.floor(scaleSec / step), MAX_TICKS - 1);
  const ticks = Array.from({ length: count + 1 }, (_, i) => i * step);
  return ticks;
}
