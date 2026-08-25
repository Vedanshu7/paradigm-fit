/**
 * Unit tests for the check domain service: raw entries in, either a full
 * result or the list of fields that stopped it (REQ-3, REQ-5, REQ-8).
 */
import { describe, expect, it } from 'vitest';

import { checkParadigmFit, verdictOf } from '@/paradigm/domain/check';

/**
 * Builds block entries from raw strings, ids counting from 1.
 *
 * @param raws - one entry per block, exactly as an operator would type it
 * @returns the block list `checkParadigmFit` expects
 */
const blocks = (...raws: string[]) => raws.map((durationRaw, i) => ({ id: i + 1, durationRaw }));

describe('checkParadigmFit', () => {
  /** Both bad fields are reported, scan first, and the projected verdict says the same. */
  it('TC-UT-050 [REQ-3] [REQ-5]: lists every invalid field in display order and refuses to check', () => {
    const result = checkParadigmFit({ scanDurationRaw: 'abc', blocks: blocks('20', '') });
    expect(result.kind).toBe('unchecked');
    if (result.kind !== 'unchecked') throw new Error('expected unchecked');
    expect(result.invalidFields).toEqual(['scan', 'block-2']);
    expect(verdictOf(result)).toEqual({ kind: 'unchecked', invalidFields: ['scan', 'block-2'] });
  });

  /** When every entry parses, one call yields everything the screen needs. */
  it('TC-UT-051 [REQ-1] [REQ-2]: a checked result carries durations, total, timings and the verdict', () => {
    const result = checkParadigmFit({ scanDurationRaw: '300', blocks: blocks('20', '20') });
    expect(result.kind).toBe('checked');
    if (result.kind !== 'checked') throw new Error('expected checked');
    expect(result.scanSec).toBe(300);
    expect(result.durations).toEqual([20, 20]);
    expect(result.totalSec).toBe(40);
    expect(result.timings.map((t) => t.startSec)).toEqual([0, 20]);
    expect(result.verdict).toEqual({ kind: 'underrun', idleSec: 260 });
  });

  /**
   * The unchecked variant carries no total at all, so there is no number a
   * caller could mistake for a verdict computed from a guessed value.
   */
  it('TC-UT-053 [REQ-5]: no value is substituted for an invalid entry', () => {
    const result = checkParadigmFit({ scanDurationRaw: '300', blocks: blocks('20', 'oops') });
    expect(result.kind).toBe('unchecked');
  });

  /**
   * Hints ride on both variants: a valid short block keeps its advisory even
   * while another field is invalid, and an invalid entry never gets one.
   */
  it('TC-UT-052 [REQ-8]: hints flag valid short blocks in both result kinds, never invalid ones', () => {
    const checked = checkParadigmFit({ scanDurationRaw: '16', blocks: blocks('8', '8') });
    expect(checked.hints).toEqual([true, true]);

    const unchecked = checkParadigmFit({ scanDurationRaw: '16', blocks: blocks('8', 'abc') });
    expect(unchecked.hints).toEqual([true, false]);
  });
});
