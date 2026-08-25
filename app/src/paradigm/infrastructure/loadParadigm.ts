import type { Block, BlockType, Paradigm } from '@/paradigm/domain/paradigm';
import data from './paradigm.json';

const isBlockType = (type: string): type is BlockType => type === 'active' || type === 'rest';

/**
 * Turns the stored JSON into a typed paradigm, checking each block's `type`,
 * the one field a JSON file can get wrong that TypeScript cannot catch. A bad
 * type fails loudly at load rather than reaching the screen.
 *
 * @param stored - the parsed JSON
 * @returns the same data as a typed paradigm
 * @throws Error when a block's `type` is not `active` or `rest`
 *
 * @requirement REQ-7
 */
export function parseParadigm(stored: {
  scanDurationSec: number;
  blocks: { id: number; label: string; type: string; durationSec: number }[];
}): Paradigm {
  const paradigm: Paradigm = {
    scanDurationSec: stored.scanDurationSec,
    blocks: stored.blocks.map((b) => {
      if (!isBlockType(b.type)) {
        throw new Error(`paradigm.json: block ${b.id} has unknown type "${b.type}"`);
      }
      const block: Block = {
        id: b.id,
        label: b.label,
        type: b.type,
        durationSec: b.durationSec,
      };
      return block;
    }),
  };
  return paradigm;
}

/**
 * The paradigm this build carries, read from `paradigm.json`.
 *
 * There is no API in scope, so the data is a JSON file bundled at build
 * time; swapping the paradigm means editing that file and rebuilding.
 *
 * @returns the stored paradigm
 *
 * @requirement REQ-7
 */
export function loadParadigm(): Paradigm {
  const paradigm = parseParadigm(data);
  return paradigm;
}
