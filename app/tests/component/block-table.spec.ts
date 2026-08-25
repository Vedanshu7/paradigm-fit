/**
 * Component tests for the editable block table: raw-string inputs with their
 * reasons and hints, and the recorded-time column (REQ-3, REQ-5, REQ-7, REQ-8).
 */
import { describe, expect, it } from 'vitest';

import BlockTable from '@/paradigm/ui/table/BlockTable.vue';
import { SHORT_BLOCKS, sixBlocks } from './lib/fixtures';
import { mountWithParadigm } from './lib/helpers';

describe('BlockTable', () => {
  /**
   * The field keeps exactly what was typed, is marked invalid, and shows the
   * reason for the specific rejection: a different message for "not a number"
   * than for "empty".
   */
  it('TC-CT-040 [REQ-3] [REQ-5]: invalid input keeps its raw text and is marked with a reason', async () => {
    const { wrapper, paradigm } = mountWithParadigm(BlockTable);
    const input = wrapper.find('#block-duration-1');

    await input.setValue('abc');
    expect(paradigm.blocks.value[0].durationRaw).toBe('abc');
    expect((input.element as HTMLInputElement).value).toBe('abc');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(wrapper.text()).toContain('Enter a plain number of seconds');

    await input.setValue('');
    expect(wrapper.text()).toContain('Enter a duration in seconds');
  });

  /**
   * With a 70 s scan over 140 s of blocks, the column must read the three
   * states in order: fully recorded, cut in half, not recorded at all.
   */
  it('TC-CT-041 [REQ-7]: the recorded column reads full / none / X of Y s', () => {
    const { wrapper } = mountWithParadigm(BlockTable, sixBlocks(70));

    const rows = wrapper.findAll('tbody tr');
    const recorded = rows.map((r) => r.findAll('td')[5].text());
    expect(recorded).toEqual(['full', 'full', 'full', '10 of 20 s', 'none', 'none']);
  });

  /**
   * A short block is advised on, not refused: the hint appears, no error
   * does, and the input is not marked invalid.
   */
  it('TC-CT-042 [REQ-8]: short but valid blocks show the atypical hint, distinct from errors', () => {
    const { wrapper } = mountWithParadigm(BlockTable, SHORT_BLOCKS);

    const note = wrapper.find('.note.hint');
    expect(note.text()).toContain('Shorter than typical');
    expect(wrapper.find('.note.error').exists()).toBe(false);
    expect(wrapper.find('#block-duration-1').attributes('aria-invalid')).toBeUndefined();
  });

  /**
   * The verdict is recomputed on the edit itself, whether it comes
   * through the field or through the state's setter.
   */
  it('TC-CT-043 [REQ-3]: an edit recomputes derived state immediately', async () => {
    const { wrapper, paradigm } = mountWithParadigm(BlockTable);
    expect(paradigm.verdict.value).toEqual({ kind: 'underrun', idleSec: 160 });

    await wrapper.find('#block-duration-1').setValue('50');
    expect(paradigm.verdict.value).toEqual({ kind: 'underrun', idleSec: 130 });

    paradigm.setScanDuration('100');
    expect(paradigm.verdict.value).toEqual({ kind: 'overflow', overflowSec: 70 });
  });
});
