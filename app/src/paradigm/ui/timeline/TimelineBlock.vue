<script setup lang="ts">
import type { BlockType } from '@/paradigm/domain/paradigm';

/**
 * One block bar on the timeline. Width is proportional to duration; a cut
 * block shows a hatch over its unrecorded tail and a struck-through label.
 *
 * @requirement REQ-6
 */
defineProps<{
  label: string;
  shortLabel: string;
  type: BlockType;
  widthPercent: number;
  unrecordedPercent: number;
  cut: boolean;
  title: string;
}>();
</script>

<template>
  <div class="block" :class="type" :style="{ width: `${widthPercent}%` }">
    <span class="block-label full" :class="{ cut }">{{ label }}</span>
    <span class="block-label short" :class="{ cut }">{{ shortLabel }}</span>
    <span class="tip">{{ title }}</span>
    <span
      v-if="cut"
      class="hatch unrecorded"
      :style="{ width: `${unrecordedPercent}%` }"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.block {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 3.4rem;
  min-width: 0;
  flex-shrink: 0;
  padding: 0 1px;
  container-type: inline-size;
}

.block.active::before,
.block.rest::before {
  content: '';
  position: absolute;
  inset: 0 1px;
  border-radius: var(--radius-small);
}

.block.active::before {
  background: var(--accent);
}

.block.rest::before {
  background: var(--neutral-soft);
  border: 1px solid var(--border);
}

.block-label {
  position: relative;
  /* Above the hatch overlay, so a cut block's label stays readable, struck through. */
  z-index: 3;
  max-width: 100%;
  padding: 0 0.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
}

.block.active .block-label {
  color: var(--accent-contrast);
}

.block.rest .block-label {
  color: var(--text-muted);
}

.block-label.cut {
  text-decoration: line-through;
  opacity: 0.65;
}

.short {
  display: none;
}

@container (max-width: 7rem) {
  .full {
    display: none;
  }

  .short {
    display: block;
  }
}

@container (max-width: 3.5rem) {
  .short {
    padding: 0 0.15rem;
    text-overflow: clip;
  }
}

@container (max-width: 1.5rem) {
  .short {
    display: none;
  }
}

.tip {
  position: absolute;
  bottom: calc(100% + 0.3rem);
  left: 50%;
  z-index: 20;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-control);
  background: var(--text);
  color: var(--bg);
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  text-decoration: none;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%);
}

.block:hover .tip {
  opacity: 1;
}

@media (prefers-reduced-motion: no-preference) {
  .tip {
    transition: opacity 120ms ease;
  }
}

.unrecorded {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  border-radius: 0 var(--radius-small) var(--radius-small) 0;
}
</style>
