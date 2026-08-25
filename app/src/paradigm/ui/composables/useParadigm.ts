import { computed, inject, provide, ref } from 'vue';

import type { InjectionKey, Ref } from 'vue';

import { checkParadigmFit, verdictOf } from '@/paradigm/domain/check';
import type { CheckResult, CheckVerdict, FieldId } from '@/paradigm/domain/check';
import type { BlockType, Paradigm } from '@/paradigm/domain/paradigm';

/** A block as edited: the duration is the raw string the operator typed (REQ-3). */
export interface WorkingBlock {
  id: number;
  label: string;
  type: BlockType;
  durationRaw: string;
}

/** What `useParadigm` hands to components: raw entries, the derived check, and the two setters. */
export interface ParadigmState {
  scanDurationRaw: Ref<string>;
  blocks: Ref<WorkingBlock[]>;
  check: Ref<CheckResult>;
  verdict: Ref<CheckVerdict>;
  isCheckable: Ref<boolean>;
  invalidFields: Ref<FieldId[]>;
  setBlockDuration: (index: number, raw: string) => void;
  setScanDuration: (raw: string) => void;
}

const PARADIGM_KEY: InjectionKey<ParadigmState> = Symbol('pf-paradigm');

/**
 * The single owner of paradigm state (ARCH-2).
 *
 * Raw input strings are the stored truth; one computed runs the
 * `checkParadigmFit` domain service and everything else reads that result, so
 * nothing on screen can disagree with what was typed.
 *
 * @param stored - the paradigm to check
 * @returns the reactive paradigm state
 *
 * @requirement REQ-3
 * @requirement REQ-5
 * @requirement REQ-7
 */
export function createParadigm(stored: Paradigm): ParadigmState {
  /** The stored truth: the scan entry exactly as typed, seeded from the paradigm. */
  const scanDurationRaw = ref(String(stored.scanDurationSec));
  /** The stored truth for each block; `durationRaw` is the string in the field. */
  const blocks = ref<WorkingBlock[]>(
    stored.blocks.map((b) => ({
      id: b.id,
      label: b.label,
      type: b.type,
      durationRaw: String(b.durationSec),
    })),
  );

  /** The one derivation everything else reads; re-runs on any edit to either ref above. */
  const check = computed<CheckResult>(() =>
    checkParadigmFit({ scanDurationRaw: scanDurationRaw.value, blocks: blocks.value }),
  );
  /** The verdict to display: the domain verdict, or `unchecked` naming the bad fields. */
  const verdict = computed<CheckVerdict>(() => verdictOf(check.value));
  /** True only when every entry parsed, so the timeline and table may draw from `check`. */
  const isCheckable = computed(() => check.value.kind === 'checked');
  /** Ids of the rejected fields, empty when the check ran. */
  const invalidFields = computed<FieldId[]>(() =>
    check.value.kind === 'unchecked' ? check.value.invalidFields : [],
  );

  /**
   * Records what the operator typed for a block, unaltered. Out-of-range
   * indexes are ignored rather than thrown, since they can only come from a
   * stale row.
   *
   * @param index - the block's position in the paradigm
   * @param raw - the field's text exactly as entered
   */
  function setBlockDuration(index: number, raw: string): void {
    const block = blocks.value[index];
    if (block !== undefined) block.durationRaw = raw;
  }

  /**
   * Records what the operator typed for the scan duration, unaltered.
   *
   * @param raw - the field's text exactly as entered
   */
  function setScanDuration(raw: string): void {
    scanDurationRaw.value = raw;
  }

  const state: ParadigmState = {
    scanDurationRaw,
    blocks,
    check,
    verdict,
    isCheckable,
    invalidFields,
    setBlockDuration,
    setScanDuration,
  };
  return state;
}

/**
 * Creates the paradigm state and provides it to the component tree below the caller.
 *
 * @param stored - the paradigm to check
 * @returns the state just provided
 */
export function provideParadigm(stored: Paradigm): ParadigmState {
  const state = createParadigm(stored);
  provide(PARADIGM_KEY, state);
  return state;
}

/**
 * Reads the paradigm state provided by the app root.
 *
 * @returns the shared paradigm state
 */
export function useParadigm(): ParadigmState {
  const state = inject(PARADIGM_KEY);
  if (state === undefined) throw new Error('useParadigm: no paradigm provided');
  return state;
}
