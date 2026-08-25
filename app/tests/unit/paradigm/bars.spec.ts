/**
 * Unit tests for the timeline's bar geometry (REQ-6), computed from a check
 * result without mounting the timeline.
 */
import { describe, expect, it } from 'vitest';

import { checkParadigmFit } from '@/paradigm/domain/check';
import { toBars } from '@/paradigm/ui/lib/bars';
import type { WorkingBlock } from '@/paradigm/ui/composables/useParadigm';

const BLOCKS: WorkingBlock[] = [
  { id: 1, label: 'Verb generation', type: 'active', durationRaw: '20' },
  { id: 2, label: 'Rest', type: 'rest', durationRaw: '30' },
];

describe('toBars', () => {
  /** Widths are the block's share of the scale the caller passes in. */
  it('TC-UT-070 [REQ-6]: sizes each bar as its share of the timeline scale', () => {
    const check = checkParadigmFit({ scanDurationRaw: '100', blocks: BLOCKS });
    const bars = toBars(BLOCKS, check, 100);
    expect(bars.map((b) => b.widthPercent)).toEqual([20, 30]);
    expect(bars.every((b) => !b.cut && b.unrecordedPercent === 0)).toBe(true);
  });

  /** A block the scan end cuts through is marked, with the hatched share and the hover text. */
  it('TC-UT-071 [REQ-6]: marks the cut block with its unrecorded share', () => {
    const check = checkParadigmFit({ scanDurationRaw: '35', blocks: BLOCKS });
    const bars = toBars(BLOCKS, check, 50);
    expect(bars[0].cut).toBe(false);
    expect(bars[1].cut).toBe(true);
    expect(bars[1].unrecordedPercent).toBe(50);
    expect(bars[1].title).toBe('Rest · 30 s · 15 s not recorded');
  });

  /** The short label is the first word, for bars too narrow for the whole. */
  it('TC-UT-072 [REQ-6]: short label is the first word of the label', () => {
    const check = checkParadigmFit({ scanDurationRaw: '100', blocks: BLOCKS });
    expect(toBars(BLOCKS, check, 100)[0].shortLabel).toBe('Verb');
  });

  /** While unchecked there is nothing to size: every bar is zero-width, none cut. */
  it('TC-UT-073 [REQ-6]: yields zero-width bars while the check cannot run', () => {
    const check = checkParadigmFit({ scanDurationRaw: 'abc', blocks: BLOCKS });
    const bars = toBars(BLOCKS, check, 1);
    expect(bars.map((b) => b.widthPercent)).toEqual([0, 0]);
    expect(bars.some((b) => b.cut)).toBe(false);
  });
});
