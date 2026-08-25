import {
  BLOCK_BOUNDS,
  SCAN_BOUNDS,
  isAtypicallyShort,
  parseDuration,
} from '@/paradigm/domain/duration';
import type { ParseResult } from '@/paradigm/domain/duration';
import { computeTimings, totalDurationSec } from '@/paradigm/domain/paradigm';
import type { BlockTiming } from '@/paradigm/domain/paradigm';
import { computeVerdict } from '@/paradigm/domain/verdict';
import type { Verdict } from '@/paradigm/domain/verdict';

/** Identifies an invalid input field: the scan field or a block by its id. */
export type FieldId = 'scan' | `block-${number}`;

/** Input to the check: raw strings exactly as the operator typed them (REQ-3). */
export interface CheckInput {
  scanDurationRaw: string;
  blocks: ReadonlyArray<{ id: number; durationRaw: string }>;
}

/** Parse results for every input, blocks index-aligned with `CheckInput.blocks`. */
export interface CheckParses {
  scan: ParseResult;
  blocks: ParseResult[];
}

/**
 * Outcome of the check. `hints` is present on both variants because a valid
 * short block deserves its hint even while another field is invalid.
 */
export type CheckResult =
  | { kind: 'unchecked'; invalidFields: FieldId[]; parses: CheckParses; hints: boolean[] }
  | {
      kind: 'checked';
      scanSec: number;
      durations: number[];
      totalSec: number;
      timings: BlockTiming[];
      verdict: Verdict;
      parses: CheckParses;
      hints: boolean[];
    };

/** The verdict shown to the operator: the domain verdict, or `unchecked` naming the invalid fields. */
export type CheckVerdict = Verdict | { kind: 'unchecked'; invalidFields: FieldId[] };

/**
 * Parses every entry against its own bounds; the scan and each block are
 * parsed independently so one bad field never hides another.
 *
 * @param input - the raw entries
 * @returns a parse result per entry, blocks index-aligned with the input
 */
function parseAll(input: CheckInput): CheckParses {
  const parses: CheckParses = {
    scan: parseDuration(input.scanDurationRaw, SCAN_BOUNDS),
    blocks: input.blocks.map((b) => parseDuration(b.durationRaw, BLOCK_BOUNDS)),
  };
  return parses;
}

/**
 * Names the rejected fields in display order, scan first, so the verdict can
 * point at each one.
 *
 * @param input - the raw entries, for the block ids
 * @param parses - their parse results
 * @returns field ids of every rejected entry; empty when all parsed
 */
function invalidFieldsOf(input: CheckInput, parses: CheckParses): FieldId[] {
  const fields: FieldId[] = [];
  if (!parses.scan.ok) fields.push('scan');
  parses.blocks.forEach((p, i) => {
    if (!p.ok) fields.push(`block-${input.blocks[i].id}`);
  });
  return fields;
}

/**
 * Per-block "shorter than typical" flags; false for invalid entries.
 *
 * @requirement REQ-8
 */
function hintsOf(parses: CheckParses): boolean[] {
  const hints = parses.blocks.map((p) => p.ok && isAtypicallyShort(p.value));
  return hints;
}

/**
 * The fit check as one pure function: parses every raw input, and only when
 * all are valid derives durations, timings and the verdict. Nothing is ever
 * substituted for an invalid value - the result says `unchecked` instead.
 *
 * @param input - raw scan and block duration strings
 * @returns the full derived state, or the invalid fields when the check cannot run
 *
 * @requirement REQ-3
 * @requirement REQ-5
 */
export function checkParadigmFit(input: CheckInput): CheckResult {
  const parses = parseAll(input);
  const invalidFields = invalidFieldsOf(input, parses);
  const hints = hintsOf(parses);
  let result: CheckResult;
  // A failed scan parse is already an invalid field; the second test only narrows the type.
  if (invalidFields.length > 0 || !parses.scan.ok) {
    result = { kind: 'unchecked', invalidFields, parses, hints };
  } else {
    // No invalid fields, so every block parse is ok and the flatMap drops nothing.
    const durations = parses.blocks.flatMap((p) => (p.ok ? [p.value] : []));
    const scanSec = parses.scan.value;
    const totalSec = totalDurationSec(durations);
    result = {
      kind: 'checked',
      scanSec,
      durations,
      totalSec,
      timings: computeTimings(durations, scanSec),
      verdict: computeVerdict(totalSec, scanSec),
      parses,
      hints,
    };
  }
  return result;
}

/**
 * Projects a check result onto the verdict the operator sees.
 *
 * @param check - a check result
 * @returns the domain verdict, or `unchecked` with the invalid field ids
 *
 * @requirement REQ-5
 */
export function verdictOf(check: CheckResult): CheckVerdict {
  let verdict: CheckVerdict;
  if (check.kind === 'unchecked') {
    verdict = { kind: 'unchecked', invalidFields: check.invalidFields };
  } else {
    verdict = check.verdict;
  }
  return verdict;
}
