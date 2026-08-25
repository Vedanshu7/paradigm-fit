<script setup lang="ts">
import { computed } from 'vue';

import { useParadigm } from '@/paradigm/ui/composables/useParadigm';
import { toBars } from '@/paradigm/ui/lib/bars';
import ScanEndMarker from '@/paradigm/ui/timeline/ScanEndMarker.vue';
import TimeRuler from '@/paradigm/ui/timeline/TimeRuler.vue';
import TimelineBlock from '@/paradigm/ui/timeline/TimelineBlock.vue';

/**
 * The timeline: proportional block bars on a `max(total, scan)` scale with
 * the scan-end marker. Renders only in the checkable state; otherwise a
 * message points at the invalid input.
 *
 * @requirement REQ-5
 * @requirement REQ-6
 */
const paradigm = useParadigm();
const { blocks, check, isCheckable, invalidFields, verdict } = paradigm;

/** Timeline scale: `max(total, scan, 1)` so the scan-end marker is always on screen. */
const scaleSec = computed(() => {
  const c = check.value;
  const scale = c.kind === 'checked' ? Math.max(c.totalSec, c.scanSec, 1) : 1;
  return scale;
});

const scanSec = computed(() => (check.value.kind === 'checked' ? check.value.scanSec : 0));
const scanLimitPercent = computed(() => (scanSec.value / scaleSec.value) * 100);
const bars = computed(() => toBars(blocks.value, check.value, scaleSec.value));
</script>

<template>
  <section class="card">
    <h2>Timeline</h2>
    <p class="card-sub">
      Block widths are proportional to duration. The dashed line is where the scanner stops.
    </p>

    <div v-if="isCheckable" class="timeline">
      <div class="lanes">
        <div class="blocks">
          <TimelineBlock
            v-for="bar in bars"
            :key="bar.id"
            :label="bar.label"
            :short-label="bar.shortLabel"
            :type="bar.type"
            :width-percent="bar.widthPercent"
            :unrecorded-percent="bar.unrecordedPercent"
            :cut="bar.cut"
            :title="bar.title"
          />
        </div>

        <TimeRuler :scale-sec="scaleSec" />

        <ScanEndMarker
          :left-percent="scanLimitPercent"
          :scan-sec="scanSec"
          :danger="verdict.kind === 'overflow'"
        />
      </div>

      <p v-if="bars.length === 0" class="empty-note">
        This paradigm has no blocks. Nothing will be presented during the scan.
      </p>

      <ul class="legend" aria-label="Legend">
        <li><i class="swatch active-swatch" /> Active</li>
        <li><i class="swatch rest-swatch" /> Rest</li>
        <li><i class="swatch hatch" /> Not recorded</li>
      </ul>
    </div>

    <p v-else class="not-checkable">
      The timeline is hidden because the check cannot run — fix the highlighted input{{
        invalidFields.length === 1 ? '' : 's'
      }}
      below.
    </p>
  </section>
</template>

<style scoped>
.lanes {
  position: relative;
  padding-top: 1.6rem;
}

.blocks {
  display: flex;
  width: 100%;
}

.empty-note,
.not-checkable {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.legend li {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.swatch {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 4px;
}

.active-swatch {
  background: var(--accent);
}

.rest-swatch {
  background: var(--neutral-soft);
  border: 1px solid var(--border);
}
</style>
