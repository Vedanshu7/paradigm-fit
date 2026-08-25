<script setup lang="ts">
/**
 * The note under a duration input: an error reason for a rejected field, or
 * the non-blocking "shorter than typical" hint. Renders nothing when there is
 * no message; the element id is referenced by the input's aria-describedby.
 *
 * @requirement REQ-5
 * @requirement REQ-8
 */
defineProps<{
  id: string;
  message: string | null;
  kind: 'error' | 'hint';
}>();
</script>

<template>
  <p v-if="message !== null" :id="id" class="note" :class="kind">{{ message }}</p>
</template>

<style scoped>
.note {
  margin: 0;
  max-width: 14rem;
  font-size: 0.75rem;
}

.note.error {
  color: var(--danger);
}

.note.hint {
  color: var(--warn);
}
</style>
