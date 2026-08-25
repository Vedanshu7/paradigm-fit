import type { CheckResult } from '@/paradigm/domain/check';
import { BLOCK_BOUNDS } from '@/paradigm/domain/duration';
import type { BlockType } from '@/paradigm/domain/paradigm';
import type { WorkingBlock } from '@/paradigm/ui/composables/useParadigm';
import { parseErrorMessage, SHORT_BLOCK_HINT } from '@/paradigm/ui/lib/messages';
import { formatSec } from '@/shared/format';

/** One table row as the block table draws it: the raw entry, its note, and the derived columns. */
export interface Row {
  id: number;
  label: string;
  type: BlockType;
  durationRaw: string;
  invalid: boolean;
  /** The error reason, else the short-block hint, else nothing. */
  note: string | null;
  noteKind: 'error' | 'hint';
  startsAt: string;
  recorded: string;
  /** True when the scan end cuts into this block. */
  lossy: boolean;
}

/**
 * Words the recorded column: "full", "none", or "X of Y s" for a block the
 * scan end cuts through.
 *
 * @param durationSec - the block's duration
 * @param recordedSec - how much of it the scanner records
 * @param unrecordedSec - how much falls past the scan end
 * @returns the cell text
 *
 * @requirement REQ-7
 */
export function recordedText(
  durationSec: number,
  recordedSec: number,
  unrecordedSec: number,
): string {
  let text: string;
  if (unrecordedSec === 0) {
    text = 'full';
  } else if (recordedSec === 0) {
    text = 'none';
  } else {
    text = `${formatSec(recordedSec)} of ${formatSec(durationSec)} s`;
  }
  return text;
}

/**
 * Turns the check result into one row per block. The error reason wins over
 * the short-block hint; the derived columns read "—" while the check cannot
 * run. Computed once per change and kept out of the component so the wording
 * can be tested without mounting anything.
 *
 * @param blocks - the working blocks, with the raw entries
 * @param check - the current check result
 * @returns rows index-aligned with `blocks`
 *
 * @requirement REQ-7
 * @requirement REQ-8
 */
export function toRows(blocks: readonly WorkingBlock[], check: CheckResult): Row[] {
  const rows = blocks.map((block, i) => {
    const parse = check.parses.blocks[i];
    const timing = check.kind === 'checked' ? check.timings[i] : undefined;
    const error = parse.ok ? null : parseErrorMessage(parse.code, BLOCK_BOUNDS);
    const row: Row = {
      id: block.id,
      label: block.label,
      type: block.type,
      durationRaw: block.durationRaw,
      invalid: !parse.ok,
      note: error ?? (check.hints[i] ? SHORT_BLOCK_HINT : null),
      noteKind: error === null ? 'hint' : 'error',
      startsAt: timing === undefined ? '—' : `${formatSec(timing.startSec)} s`,
      recorded:
        timing === undefined || check.kind !== 'checked'
          ? '—'
          : recordedText(check.durations[i], timing.recordedSec, timing.unrecordedSec),
      lossy: timing !== undefined && timing.unrecordedSec > 0,
    };
    return row;
  });
  return rows;
}
