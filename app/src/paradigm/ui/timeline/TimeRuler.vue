<script setup lang="ts">
import { computed } from 'vue';

import { computeTicks } from '@/paradigm/ui/lib/ticks';

/**
 * The time axis under the track: one labelled tick per step of the shared
 * timeline scale, so a block's width can be read in seconds.
 *
 * @requirement REQ-6
 */
const props = defineProps<{ scaleSec: number }>();

const ticks = computed(() => computeTicks(props.scaleSec));

/**
 * Positions a tick on the track as a percentage of the timeline scale.
 *
 * @param sec - the tick's time in seconds
 * @returns its horizontal position as a percentage of the track width
 */
function percentOf(sec: number): number {
  const percent = (sec / props.scaleSec) * 100;
  return percent;
}
</script>

<template>
  <div class="ruler" aria-hidden="true">
    <span v-for="tick in ticks" :key="tick" class="tick" :style="{ left: `${percentOf(tick)}%` }">
      <span class="mark" />
      <span class="mono label">{{ tick }}</span>
    </span>
  </div>
</template>

<style scoped>
.ruler {
  position: relative;
  height: 1.4rem;
  border-top: 1px solid var(--border);
  margin-top: 0.25rem;
}

.tick {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

.tick:first-child {
  align-items: flex-start;
  transform: none;
}

.tick:last-child {
  align-items: flex-end;
  transform: translateX(-100%);
}

.mark {
  width: 1px;
  height: 0.4rem;
  background: var(--border);
}

.label {
  font-size: 0.65rem;
  color: var(--text-muted);
}
</style>
