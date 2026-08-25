/**
 * Unit tests for the paradigm repository (REQ-7): the bundled file must load
 * with the shape the domain expects, and a bad block type must fail at load
 * rather than reach the screen.
 */
import { describe, expect, it } from 'vitest';

import { loadParadigm, parseParadigm } from '@/paradigm/infrastructure/loadParadigm';

describe('parseParadigm', () => {
  /** The bundled file is a 300 s scan over six typed blocks. */
  it('TC-UT-090 [REQ-7]: loads the bundled paradigm with typed blocks', () => {
    const paradigm = loadParadigm();
    expect(paradigm.scanDurationSec).toBe(300);
    expect(paradigm.blocks).toHaveLength(6);
    expect(paradigm.blocks.map((b) => b.type)).toEqual([
      'active',
      'rest',
      'active',
      'rest',
      'active',
      'rest',
    ]);
  });

  /** A misspelt block type is refused with the block id, not silently kept. */
  it('TC-UT-091 [REQ-7]: refuses a block whose type is not active or rest', () => {
    const bad = {
      scanDurationSec: 60,
      blocks: [{ id: 2, label: 'Rest', type: 'pause', durationSec: 20 }],
    };
    expect(() => parseParadigm(bad)).toThrow('block 2 has unknown type "pause"');
  });
});
