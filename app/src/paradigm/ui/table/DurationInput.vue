<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const model = defineModel<string>({ required: true });

/**
 * A seconds field. Plain text, never `type=number`, so what the operator
 * typed is passed on unchanged for the domain to judge; `invalid` only
 * styles it and sets aria-invalid.
 *
 * @requirement REQ-3
 */
defineProps<{ invalid: boolean }>();
</script>

<template>
  <span class="duration-input" :class="{ invalid }">
    <input
      v-bind="$attrs"
      v-model="model"
      type="text"
      inputmode="decimal"
      autocomplete="off"
      spellcheck="false"
      class="mono"
      :aria-invalid="invalid || undefined"
    />
    <span class="unit" aria-hidden="true">s</span>
  </span>
</template>

<style scoped>
.duration-input {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

input {
  width: 5.5rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-control);
  background: var(--surface-raised);
  color: var(--text);
  font-size: 0.9rem;
}

input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.invalid input {
  border-color: var(--danger);
  background: var(--danger-soft);
}

.invalid input:focus-visible {
  outline-color: var(--danger);
}

.unit {
  color: var(--text-muted);
  font-size: 0.85rem;
}
</style>
