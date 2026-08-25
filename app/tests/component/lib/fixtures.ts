import type { Paradigm } from '@/paradigm/domain/paradigm';

/**
 * The bundled paradigm (six blocks, 140 s in total) against a scan of
 * the caller's choosing. Each verdict is reached by picking the scan: 300 s
 * leaves time unused, 140 s fits exactly, 125 s cuts the last block in half,
 * 70 s loses two blocks outright.
 *
 * @param scanDurationSec - the programmed scan duration
 * @returns a fresh paradigm object; tests may mutate it freely
 */
export function sixBlocks(scanDurationSec: number): Paradigm {
  const paradigm: Paradigm = {
    scanDurationSec,
    blocks: [
      { id: 1, label: 'Verb generation', type: 'active', durationSec: 20 },
      { id: 2, label: 'Rest', type: 'rest', durationSec: 20 },
      { id: 3, label: 'Verb generation', type: 'active', durationSec: 20 },
      { id: 4, label: 'Rest', type: 'rest', durationSec: 20 },
      { id: 5, label: 'Finger tapping', type: 'active', durationSec: 30 },
      { id: 6, label: 'Rest', type: 'rest', durationSec: 30 },
    ],
  };
  return paradigm;
}

/** Every block under the 10 s typical minimum, yet the paradigm fits: hints without errors. */
export const SHORT_BLOCKS: Paradigm = {
  scanDurationSec: 48,
  blocks: [
    { id: 1, label: 'Task 1', type: 'active', durationSec: 8 },
    { id: 2, label: 'Rest', type: 'rest', durationSec: 8 },
    { id: 3, label: 'Task 3', type: 'active', durationSec: 8 },
    { id: 4, label: 'Rest', type: 'rest', durationSec: 8 },
    { id: 5, label: 'Task 5', type: 'active', durationSec: 8 },
    { id: 6, label: 'Rest', type: 'rest', durationSec: 8 },
  ],
};

/** Fractional durations whose float sum (68.5) must display without rounding noise. */
export const FRACTIONAL: Paradigm = {
  scanDurationSec: 60,
  blocks: [
    { id: 1, label: 'Task 1', type: 'active', durationSec: 12.5 },
    { id: 2, label: 'Rest', type: 'rest', durationSec: 15.5 },
    { id: 3, label: 'Task 3', type: 'active', durationSec: 12.5 },
    { id: 4, label: 'Rest', type: 'rest', durationSec: 15.5 },
    { id: 5, label: 'Task 5', type: 'active', durationSec: 12.5 },
  ],
};
