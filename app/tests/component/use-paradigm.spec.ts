/**
 * Tests for the paradigm state composable, driven directly through
 * `createParadigm` without mounting anything: what is stored, what is
 * derived, and when (REQ-3, REQ-5, REQ-8).
 */
import { describe, expect, it } from 'vitest';

import { loadParadigm } from '@/paradigm/infrastructure/loadParadigm';
import { createParadigm } from '@/paradigm/ui/composables/useParadigm';
import { SHORT_BLOCKS } from './lib/fixtures';

describe('paradigm state - raw input model', () => {
  /** The setters store the string as given, including strings that cannot parse. */
  it('TC-CT-001 [REQ-3]: keeps the raw string exactly as entered, never coerces', () => {
    const state = createParadigm(loadParadigm());
    state.setBlockDuration(0, 'abc');
    expect(state.blocks.value[0].durationRaw).toBe('abc');
    state.setScanDuration('');
    expect(state.scanDurationRaw.value).toBe('');
  });

  /**
   * The verdict is a derivation, not stored state: it becomes `unchecked` on
   * the same tick the entry goes bad, and recovers on the same tick it is fixed.
   */
  it('TC-CT-002 [REQ-5] [REQ-3]: invalid input flips the verdict to unchecked immediately, and back on fix', () => {
    const state = createParadigm(loadParadigm());
    expect(state.verdict.value.kind).toBe('underrun');
    state.setBlockDuration(1, '');
    expect(state.verdict.value).toEqual({ kind: 'unchecked', invalidFields: ['block-2'] });
    state.setBlockDuration(1, '20');
    expect(state.verdict.value.kind).toBe('underrun');
  });

  /** Two bad entries at once are both named, scan first, so each can be marked. */
  it('TC-CT-004 [REQ-5]: an unchecked verdict lists every invalid field', () => {
    const state = createParadigm(loadParadigm());
    state.setScanDuration('abc');
    state.setBlockDuration(0, '0');
    expect(state.verdict.value).toEqual({ kind: 'unchecked', invalidFields: ['scan', 'block-1'] });
  });
});

describe('paradigm state - the carried paradigm', () => {
  /**
   * The bundled paradigm arrives as numbers and is held as strings from the
   * start, so the operator's first edit and the initial value obey one rule.
   */
  it('TC-CT-003 [REQ-3]: loads the paradigm the software carries, as raw strings', () => {
    const state = createParadigm(loadParadigm());
    expect(state.scanDurationRaw.value).toBe('300');
    expect(state.blocks.value.map((b) => b.durationRaw)).toEqual([
      '20',
      '20',
      '20',
      '20',
      '30',
      '30',
    ]);
    expect(state.blocks.value.map((b) => b.label)).toEqual([
      'Verb generation',
      'Rest',
      'Verb generation',
      'Rest',
      'Finger tapping',
      'Rest',
    ]);
  });

  /** A hint needs a valid short duration; an unparseable entry gets an error instead, never a hint. */
  it('TC-CT-006 [REQ-8]: block hints flag valid durations under 10 s only', () => {
    const state = createParadigm(SHORT_BLOCKS);
    expect(state.check.value.hints.every(Boolean)).toBe(true);
    state.setBlockDuration(0, 'abc');
    expect(state.check.value.hints[0]).toBe(false);
  });
});
