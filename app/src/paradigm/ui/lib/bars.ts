import type { CheckResult } from '@/paradigm/domain/check';
import type { BlockType } from '@/paradigm/domain/paradigm';
import type { WorkingBlock } from '@/paradigm/ui/composables/useParadigm';
import { formatSec } from '@/shared/format';

/** One block bar as the timeline draws it: geometry in percent of the track, plus labels. */
export interface Bar {
  id: number;
  label: string;
  /** The first word of the label, shown when the bar is too narrow for the whole. */
  shortLabel: string;
  type: BlockType;
  widthPercent: number;
  /** Share of the bar past the scan end, hatched; 0 when fully recorded. */
  unrecordedPercent: number;
  cut: boolean;
  /** Hover text: label, duration, and the unrecorded seconds when cut. */
  title: string;
}

const WHITESPACE = /\s+/;

/**
 * Turns the check result into one bar per block, sized against the timeline
 * scale. Computed once per change rather than per render, and kept out of the
 * component so the geometry can be tested without mounting anything.
 *
 * @param blocks - the working blocks, for ids, labels and types
 * @param check - the current check result; bars are zero-width while unchecked
 * @param scaleSec - the timeline scale, `max(total, scan)`
 * @returns bars index-aligned with `blocks`
 *
 * @requirement REQ-6
 */
export function toBars(
  blocks: readonly WorkingBlock[],
  check: CheckResult,
  scaleSec: number,
): Bar[] {
  const bars = blocks.map((block, i) => {
    const duration = check.kind === 'checked' ? check.durations[i] : 0;
    const timing = check.kind === 'checked' ? check.timings[i] : undefined;
    const cut = timing !== undefined && timing.unrecordedSec > 0;
    const base = block.label + ' · ' + formatSec(duration) + ' s';
    const bar: Bar = {
      id: block.id,
      label: block.label,
      shortLabel: block.label.split(WHITESPACE)[0],
      type: block.type,
      widthPercent: (duration / scaleSec) * 100,
      unrecordedPercent: cut ? (timing.unrecordedSec / duration) * 100 : 0,
      cut,
      title: cut ? base + ' · ' + formatSec(timing.unrecordedSec) + ' s not recorded' : base,
    };
    return bar;
  });
  return bars;
}
