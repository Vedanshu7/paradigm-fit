/**
 * Component tests for the timeline: proportional widths, the scan-end marker,
 * the marking of unrecorded portions, and its withdrawal while input is
 * invalid (REQ-5, REQ-6).
 */
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import ParadigmTimeline from '@/paradigm/ui/timeline/ParadigmTimeline.vue';
import { sixBlocks } from './lib/fixtures';
import { mountWithParadigm } from './lib/helpers';

describe('ParadigmTimeline', () => {
  /** A 20 s block on a 300 s scan is 20/300 of the track: one shared scale, here the scan. */
  it('TC-CT-032 [REQ-6]: block widths are proportional to duration on the shared scale', () => {
    const { wrapper } = mountWithParadigm(ParadigmTimeline);
    const first = wrapper.findAll('.block')[0];
    expect(first.attributes('style')).toContain('width: 6.66');
  });

  /**
   * The marker sits at the scan position and carries its position as a CSS
   * variable, which is what slides the label across it: 0.5 midway, 1 at the
   * end where the label must hang to the left to stay on the track.
   */
  it('TC-CT-033 [REQ-6]: the scan-end marker sits at the scan position and its label slides with it to stay on the track', () => {
    const midway = mountWithParadigm(ParadigmTimeline, sixBlocks(70)).wrapper;
    expect(midway.find('.scan-limit').attributes('style')).toContain('left: 50%');
    expect(midway.find('.scan-limit').attributes('style')).toContain('--at: 0.5');

    const atTheEnd = mountWithParadigm(ParadigmTimeline, sixBlocks(140)).wrapper;
    expect(atTheEnd.find('.scan-limit').attributes('style')).toContain('left: 100%');
    expect(atTheEnd.find('.scan-limit').attributes('style')).toContain('--at: 1');
  });

  /**
   * With the scan ending mid-way through the last block, that block alone is
   * hatched and struck through; the first block, fully recorded, is not.
   */
  it('TC-CT-034 [REQ-6]: cut blocks get a hatch overlay and a struck-through label', () => {
    const { wrapper } = mountWithParadigm(ParadigmTimeline, sixBlocks(125));

    const blocks = wrapper.findAll('.block');
    const last = blocks.at(-1);
    expect(last?.find('.hatch').exists()).toBe(true);
    expect(last?.find('.block-label').classes()).toContain('cut');
    expect(blocks[0].find('.hatch').exists()).toBe(false);
  });

  /**
   * One invalid entry removes the whole timeline in favour of guidance; it
   * returns as soon as the entry is fixed. Nothing partial is ever drawn.
   */
  it('TC-CT-035 [REQ-5]: the timeline is replaced by guidance while any input is invalid', async () => {
    const { wrapper, paradigm } = mountWithParadigm(ParadigmTimeline);
    paradigm.setBlockDuration(0, '');
    await nextTick();

    expect(wrapper.find('.blocks').exists()).toBe(false);
    expect(wrapper.text()).toContain('fix the highlighted input');

    paradigm.setBlockDuration(0, '20');
    await nextTick();
    expect(wrapper.find('.blocks').exists()).toBe(true);
  });

  /** On the bundled 300 s scan the ruler shows 0 to 300 in 15 s steps: 21 ticks, first 0, last 300. */
  it('TC-CT-036 [REQ-6]: the ruler renders one tick per step of the shared scale', () => {
    const { wrapper } = mountWithParadigm(ParadigmTimeline);
    const ticks = wrapper.findAll('.tick');
    expect(ticks).toHaveLength(21);
    expect(ticks[0].text()).toBe('0');
    expect(ticks[20].text()).toBe('300');
  });
});
