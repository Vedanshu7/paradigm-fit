<script setup lang="ts">
import { computed } from 'vue';

import { SCAN_BOUNDS } from '@/paradigm/domain/duration';
import { useParadigm } from '@/paradigm/ui/composables/useParadigm';
import { parseErrorMessage, verdictDetail, verdictTitle } from '@/paradigm/ui/lib/messages';
import { formatSec } from '@/shared/format';
import DurationInput from '@/paradigm/ui/table/DurationInput.vue';
import ValidationMessage from '@/paradigm/ui/verdict/ValidationMessage.vue';

/**
 * The verdict panel: four states (fits exactly / fits with unused scan time /
 * does not fit / cannot check), each expressed through icon, text and colour
 * together, plus the scan-duration input with its rejection reason.
 *
 * @requirement REQ-2
 * @requirement REQ-5
 * @requirement REQ-7
 */
const paradigm = useParadigm();
const { verdict, scanDurationRaw, check } = paradigm;

const totalSec = computed(() => (check.value.kind === 'checked' ? check.value.totalSec : 0));
const scanSec = computed(() => (check.value.kind === 'checked' ? check.value.scanSec : 0));
const kind = computed(() => verdict.value.kind);
const title = computed(() => verdictTitle(kind.value));
const detail = computed(() => verdictDetail(verdict.value));

/** The reason shown under the scan field while its entry is rejected; null when accepted. */
const scanError = computed(() => {
  const parse = check.value.parses.scan;
  const message = parse.ok ? null : parseErrorMessage(parse.code, SCAN_BOUNDS);
  return message;
});
</script>

<template>
  <section class="verdict" :class="kind" :data-verdict="kind">
    <div class="headline">
      <Transition name="verdict-icon" mode="out-in">
        <svg
          v-if="kind === 'fits'"
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.5 2.5 4.5-5.5" />
        </svg>
        <svg
          v-else-if="kind === 'overflow'"
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M12 3 2.5 20h19L12 3z" />
          <path d="M12 10v4.5" />
          <circle cx="12" cy="17.2" r="0.4" fill="currentColor" />
        </svg>
        <svg
          v-else-if="kind === 'underrun'"
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <circle cx="12" cy="8" r="0.4" fill="currentColor" />
        </svg>
        <svg
          v-else
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.33c-.7.28-.9.84-.9 1.67" />
          <circle cx="12" cy="16.5" r="0.4" fill="currentColor" />
        </svg>
      </Transition>
      <div>
        <p class="eyebrow">{{ title }}</p>
        <p v-if="kind !== 'unchecked'" class="numbers mono">
          {{ formatSec(totalSec) }}<span class="muted"> / {{ formatSec(scanSec) }} s</span>
        </p>
        <p v-else class="numbers mono muted">— / — s</p>
        <p class="detail">{{ detail }}</p>
      </div>
    </div>

    <div class="scan-field">
      <label for="scan-duration">Scan duration</label>
      <DurationInput
        id="scan-duration"
        :model-value="scanDurationRaw"
        :invalid="scanError !== null"
        :aria-describedby="scanError !== null ? 'scan-duration-error' : undefined"
        @update:model-value="paradigm.setScanDuration($event)"
      />
      <ValidationMessage id="scan-duration-error" :message="scanError" kind="error" />
    </div>
  </section>
</template>

<style scoped>
.verdict {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.25rem;
  align-items: start;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  background: var(--surface);
}

.verdict.fits {
  border-color: color-mix(in oklab, var(--accent) 45%, var(--border));
  background: var(--accent-soft);
}

.verdict.underrun {
  border-color: color-mix(in oklab, var(--info) 45%, var(--border));
  background: var(--info-soft);
}

.verdict.overflow {
  border-color: color-mix(in oklab, var(--danger) 45%, var(--border));
  background: var(--danger-soft);
}

.verdict.unchecked {
  background: var(--neutral-soft);
}

.headline {
  display: flex;
  gap: 0.9rem;
}

.icon {
  width: 1.8rem;
  height: 1.8rem;
  flex-shrink: 0;
  margin-top: 0.15rem;
}

.fits .icon,
.fits .eyebrow {
  color: var(--accent);
}

.underrun .icon,
.underrun .eyebrow {
  color: var(--info);
}

.overflow .icon,
.overflow .eyebrow {
  color: var(--danger);
}

.unchecked .icon,
.unchecked .eyebrow {
  color: var(--neutral);
}

.eyebrow {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.numbers {
  margin: 0.1rem 0 0;
  font-size: 1.9rem;
  font-weight: 600;
}

.muted {
  color: var(--text-muted);
}

.detail {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
}

.scan-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.scan-field label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

@media (max-width: 720px) {
  .verdict {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .verdict {
    transition:
      background-color 200ms ease,
      border-color 200ms ease;
  }

  .verdict-icon-enter-active,
  .verdict-icon-leave-active {
    transition: opacity 120ms ease;
  }

  .verdict-icon-enter-from,
  .verdict-icon-leave-to {
    opacity: 0;
  }
}
</style>
