/**
 * Unit tests for the block table's row view-model (REQ-7, REQ-8): the note
 * under each field and the derived columns, computed without mounting.
 */
import { describe, expect, it } from 'vitest';

import { checkParadigmFit } from '@/paradigm/domain/check';
import { recordedText, toRows } from '@/paradigm/ui/lib/rows';
import type { WorkingBlock } from '@/paradigm/ui/composables/useParadigm';

const blocks = (...raws: string[]): WorkingBlock[] =>
  raws.map((durationRaw, i) => ({
    id: i + 1,
    label: `Block ${i + 1}`,
    type: 'active',
    durationRaw,
  }));

describe('recordedText', () => {
  /** Three wordings for the three ways a block can meet the scan end. */
  it('TC-UT-080 [REQ-7]: reads full, none, or X of Y s', () => {
    expect(recordedText(20, 20, 0)).toBe('full');
    expect(recordedText(20, 0, 20)).toBe('none');
    expect(recordedText(20, 10, 10)).toBe('10 of 20 s');
  });
});

describe('toRows', () => {
  /** With a 70 s scan over 20/20/20/20/30 s blocks, the columns read in order. */
  it('TC-UT-081 [REQ-7]: derives start and recorded columns from the check', () => {
    const b = blocks('20', '20', '20', '20', '30');
    const rows = toRows(b, checkParadigmFit({ scanDurationRaw: '70', blocks: b }));
    expect(rows.map((r) => r.startsAt)).toEqual(['0 s', '20 s', '40 s', '60 s', '80 s']);
    expect(rows.map((r) => r.recorded)).toEqual(['full', 'full', 'full', '10 of 20 s', 'none']);
    expect(rows.map((r) => r.lossy)).toEqual([false, false, false, true, true]);
  });

  /** A rejected entry shows its reason as an error; a short valid entry shows the hint. */
  it('TC-UT-082 [REQ-7] [REQ-8]: the error reason wins over the short-block hint', () => {
    const b = blocks('abc', '8', '20');
    const rows = toRows(b, checkParadigmFit({ scanDurationRaw: '60', blocks: b }));
    expect(rows[0]).toMatchObject({
      invalid: true,
      noteKind: 'error',
      startsAt: '—',
      recorded: '—',
    });
    expect(rows[0].note).toContain('plain number');
    expect(rows[1]).toMatchObject({ invalid: false, noteKind: 'hint' });
    expect(rows[1].note).toContain('Shorter than typical');
    expect(rows[2].note).toBeNull();
  });
});
