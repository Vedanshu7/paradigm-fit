/**
 * Component tests for the verdict panel: the four states and the scan
 * duration field it hosts (REQ-2, REQ-3, REQ-5).
 */
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';

import FitVerdict from '@/paradigm/ui/verdict/FitVerdict.vue';
import { FRACTIONAL } from './lib/fixtures';
import { mountWithParadigm } from './lib/helpers';

describe('FitVerdict', () => {
  /**
   * Walks the panel through all four states by editing only the scan
   * duration, checking the state attribute and the title in each, and that
   * the icon is present, so no channel can disagree with another.
   */
  it('TC-CT-030 [REQ-2]: each state renders icon, text, and state class together', async () => {
    const { wrapper, paradigm } = mountWithParadigm(FitVerdict);

    expect(wrapper.attributes('data-verdict')).toBe('underrun');
    expect(wrapper.text()).toContain('Fits, scan time unused');
    expect(wrapper.find('svg.icon').exists()).toBe(true);

    paradigm.setScanDuration('140');
    await nextTick();
    expect(wrapper.attributes('data-verdict')).toBe('fits');
    expect(wrapper.find('.eyebrow').text()).toBe('Fits');
    expect(wrapper.find('svg.icon').exists()).toBe(true);

    paradigm.setScanDuration('100');
    await nextTick();
    expect(wrapper.attributes('data-verdict')).toBe('overflow');
    expect(wrapper.text()).toContain('Does not fit');
    expect(wrapper.text()).toContain('will not be recorded');

    paradigm.setScanDuration('500');
    await nextTick();
    expect(wrapper.attributes('data-verdict')).toBe('underrun');
    expect(wrapper.text()).toContain('All blocks are recorded');
    expect(wrapper.text()).toContain('Ideally the two match');

    paradigm.setScanDuration('abc');
    await nextTick();
    expect(wrapper.attributes('data-verdict')).toBe('unchecked');
    expect(wrapper.text()).toContain('Cannot check');
  });

  /**
   * A fractional total (68.5 s) displays as typed rather than as float noise,
   * and an out-of-range scan entry is marked with the reason for its rejection.
   */
  it('TC-CT-031 [REQ-5] [REQ-3]: the scan field marks invalid input with a reason; times render formatted', async () => {
    const { wrapper, paradigm } = mountWithParadigm(FitVerdict, FRACTIONAL);

    expect(wrapper.text()).toContain('68.5');

    paradigm.setScanDuration('9000');
    await nextTick();
    const input = wrapper.find('#scan-duration');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(wrapper.text()).toContain('Must be at most 7200 s');
  });
});
