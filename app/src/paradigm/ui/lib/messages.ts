import type { CheckVerdict } from '@/paradigm/domain/check';
import type { Bounds, ParseErrorCode } from '@/paradigm/domain/duration';
import { formatSec } from '@/shared/format';

/**
 * Renders a validation error code as the operator-facing reason shown at the field.
 *
 * @param code - the violated rule from `parseDuration`
 * @param bounds - the limits that were checked, used to word the range messages
 * @returns a short instruction the operator can act on
 *
 * @requirement REQ-4
 * @requirement REQ-5
 */
export function parseErrorMessage(code: ParseErrorCode, bounds: Bounds): string {
  let message: string;
  switch (code) {
    case 'empty':
      message = 'Enter a duration in seconds';
      break;
    case 'not-a-number':
      message = 'Enter a plain number of seconds, like 20 or 12.5';
      break;
    case 'too-small':
      message = `Must be at least ${bounds.min} s`;
      break;
    case 'too-large':
      message = `Must be at most ${bounds.max} s`;
      break;
  }
  return message;
}

/**
 * The non-blocking note under a block that is valid but shorter than typical.
 *
 * @requirement REQ-8
 */
export const SHORT_BLOCK_HINT = 'Shorter than typical (10–20 s)';

const VERDICT_TITLES: Record<CheckVerdict['kind'], string> = {
  fits: 'Fits',
  underrun: 'Fits, scan time unused',
  overflow: 'Does not fit',
  unchecked: 'Cannot check',
};

/**
 * The verdict's headline, one of the four verdict names.
 *
 * @param kind - the verdict kind
 * @returns the title shown above the numbers
 *
 * @requirement REQ-2
 */
export function verdictTitle(kind: CheckVerdict['kind']): string {
  const title = VERDICT_TITLES[kind];
  return title;
}

/**
 * The sentence under the verdict title: what happened and, for a mismatch,
 * by how much. Wording carries the number so the operator never has to
 * subtract for themselves.
 *
 * @param verdict - the verdict to describe
 * @returns one sentence for a fit, two for an overflow, underrun or unchecked result
 *
 * @requirement REQ-2
 * @requirement REQ-5
 */
export function verdictDetail(verdict: CheckVerdict): string {
  let detail: string;
  switch (verdict.kind) {
    case 'fits':
      detail = 'Paradigm matches the scan duration exactly.';
      break;
    case 'underrun':
      detail = `All blocks are recorded; the paradigm ends ${formatSec(verdict.idleSec)} s before the scan does. Ideally the two match.`;
      break;
    case 'overflow':
      detail = `Paradigm runs ${formatSec(verdict.overflowSec)} s past the end of the scan. The blocks past the line will not be recorded.`;
      break;
    case 'unchecked':
      detail =
        verdict.invalidFields.length === 1
          ? 'One input is invalid — fix the highlighted field to run the check.'
          : `${verdict.invalidFields.length} inputs are invalid — fix the highlighted fields to run the check.`;
      break;
  }
  return detail;
}
