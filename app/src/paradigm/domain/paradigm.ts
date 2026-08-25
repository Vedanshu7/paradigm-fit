/** Block kind: `active` presents a task, `rest` is a baseline pause. */
export type BlockType = 'active' | 'rest';

/** One paradigm block as stored in `paradigm.json`; `durationSec` is in seconds. */
export interface Block {
  id: number;
  label: string;
  type: BlockType;
  durationSec: number;
}

/** A stimulus paradigm: ordered blocks against one scan duration, both in seconds. */
export interface Paradigm {
  scanDurationSec: number;
  blocks: Block[];
}

/**
 * Tolerance for comparing float seconds, in seconds. Sums of decimal
 * durations carry rounding noise (`0.1 + 0.2`), so equality with the scan is
 * decided within this margin. A design decision (DD-1), not a requirement.
 */
export const FIT_TOLERANCE_SEC = 1e-9;

/**
 * A block's computed position on the scan, all fields in seconds.
 * `recordedSec + unrecordedSec` always equals the block's duration.
 */
export interface BlockTiming {
  startSec: number;
  endSec: number;
  recordedSec: number;
  unrecordedSec: number;
}

/**
 * Sums block durations into the total paradigm duration.
 *
 * @param durationsSec - validated block durations in seconds, in paradigm order
 * @returns the total in seconds (0 for an empty paradigm)
 *
 * @requirement REQ-1
 */
export function totalDurationSec(durationsSec: number[]): number {
  const total = durationsSec.reduce((sum, d) => sum + d, 0);
  return total;
}

/**
 * Computes each block's position on the scan and how much of it is recorded.
 *
 * Start is the sum of all preceding durations; recorded time is clamped to the
 * scan end (`max(0, min(end, scan) - start)`); unrecorded is the remainder, so
 * `recorded + unrecorded === duration` for every block. A remainder below
 * {@link FIT_TOLERANCE_SEC} is float noise from the running sum, not a cut,
 * and is reported as zero so a block that fits is never marked unrecorded.
 *
 * @param durationsSec - validated block durations in seconds, in paradigm order
 * @param scanDurationSec - validated scan duration in seconds
 * @returns one timing per block, index-aligned with the input
 *
 * @requirement REQ-1
 */
export function computeTimings(durationsSec: number[], scanDurationSec: number): BlockTiming[] {
  let cursor = 0;
  const timings = durationsSec.map((duration) => {
    const startSec = cursor;
    const endSec = startSec + duration;
    cursor = endSec;
    const rawRecordedSec = Math.max(0, Math.min(endSec, scanDurationSec) - startSec);
    const noise = duration - rawRecordedSec < FIT_TOLERANCE_SEC;
    const recordedSec = noise ? duration : rawRecordedSec;
    const timing: BlockTiming = {
      startSec,
      endSec,
      recordedSec,
      unrecordedSec: noise ? 0 : duration - recordedSec,
    };
    return timing;
  });
  return timings;
}
