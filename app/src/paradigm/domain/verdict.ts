import { FIT_TOLERANCE_SEC } from '@/paradigm/domain/paradigm';

/**
 * Outcome of the fit check; amounts are in seconds.
 * The check adds a fourth `unchecked` kind when input is invalid (see `check.ts`).
 */
export type Verdict =
  | { kind: 'fits' }
  | { kind: 'overflow'; overflowSec: number }
  | { kind: 'underrun'; idleSec: number };

/**
 * Decides whether the paradigm fits the scan.
 *
 * Fits means the absolute difference is below {@link FIT_TOLERANCE_SEC}, so
 * decimal durations whose float sum carries rounding noise still compare equal.
 * Otherwise the verdict reports the direction and size of the mismatch.
 *
 * @param totalSec - total paradigm duration in seconds
 * @param scanDurationSec - scan duration in seconds
 * @returns fits, overflow (with seconds past the scan end), or underrun (with unused seconds)
 *
 * @requirement REQ-2
 */
export function computeVerdict(totalSec: number, scanDurationSec: number): Verdict {
  const diff = totalSec - scanDurationSec;
  let verdict: Verdict;
  if (Math.abs(diff) < FIT_TOLERANCE_SEC) {
    verdict = { kind: 'fits' };
  } else if (diff > 0) {
    verdict = { kind: 'overflow', overflowSec: diff };
  } else {
    verdict = { kind: 'underrun', idleSec: -diff };
  }
  return verdict;
}
