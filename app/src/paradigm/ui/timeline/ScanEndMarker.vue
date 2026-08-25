<script setup lang="ts">
import { formatSec } from '@/shared/format';

/**
 * The dashed "scan ends" line at the scan duration position; the label slides
 * across the marker with its position so it stays within the track.
 *
 * @requirement REQ-6
 */
defineProps<{
  leftPercent: number;
  scanSec: number;
  danger: boolean;
}>();
</script>

<template>
  <div
    class="scan-limit"
    :class="{ danger }"
    :style="{ left: `${leftPercent}%`, '--at': leftPercent / 100 }"
  >
    <span class="scan-limit-label">scan ends · {{ formatSec(scanSec) }} s</span>
  </div>
</template>

<style scoped>
.scan-limit {
  position: absolute;
  top: 0;
  bottom: 1.4rem;
  border-left: 2px dashed var(--text-muted);
  pointer-events: none;
  transform: translateX(-2px);
}

.scan-limit.danger {
  border-left-color: var(--danger);
}

.scan-limit-label {
  position: absolute;
  top: 0;
  transform: translate(calc(-100% * var(--at)), -10%);
  padding: 0.1rem 0.4rem;
  border-radius: var(--radius-small);
  background: var(--text);
  color: var(--bg);
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
}

.scan-limit.danger .scan-limit-label {
  background: var(--danger);
  color: var(--danger-contrast);
}
</style>
