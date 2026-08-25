<script setup lang="ts">
import { computed } from 'vue';

import { useParadigm } from '@/paradigm/ui/composables/useParadigm';
import { toRows } from '@/paradigm/ui/lib/rows';
import DurationInput from '@/paradigm/ui/table/DurationInput.vue';
import ValidationMessage from '@/paradigm/ui/verdict/ValidationMessage.vue';

/**
 * The editable block table: one raw-string input per block with its error or
 * hint note, plus start time and recorded time once the check can run.
 *
 * @requirement REQ-7
 * @requirement REQ-8
 */
const paradigm = useParadigm();
const { blocks, check } = paradigm;

const rows = computed(() => toRows(blocks.value, check.value));
</script>

<template>
  <section class="card">
    <h2>Blocks</h2>
    <p class="card-sub">Edit a duration and the check updates as you type.</p>

    <table>
      <thead>
        <tr>
          <th class="num">#</th>
          <th>Block</th>
          <th>Type</th>
          <th>Duration</th>
          <th class="right">Starts at</th>
          <th class="right">Recorded</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="row.id" :class="{ lossy: row.lossy }">
          <td class="num mono">{{ i + 1 }}</td>
          <td class="label-cell">{{ row.label }}</td>
          <td>
            <span class="badge" :class="row.type">{{ row.type }}</span>
          </td>
          <td>
            <div class="duration-cell">
              <DurationInput
                :id="`block-duration-${row.id}`"
                :model-value="row.durationRaw"
                :invalid="row.invalid"
                :aria-describedby="row.note !== null ? `block-duration-${row.id}-note` : undefined"
                :aria-label="`Duration of ${row.label}`"
                @update:model-value="paradigm.setBlockDuration(i, $event)"
              />
              <ValidationMessage
                :id="`block-duration-${row.id}-note`"
                :message="row.note"
                :kind="row.noteKind"
              />
            </div>
          </td>
          <td class="right mono muted">{{ row.startsAt }}</td>
          <td class="right mono" :class="{ danger: row.lossy }">
            {{ row.recorded }}
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td colspan="6" class="muted empty">This paradigm has no blocks.</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th {
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

th,
td {
  padding: 0.5rem 0.6rem;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}

tbody tr:last-child td {
  border-bottom: none;
}

tr.lossy {
  background: var(--danger-soft);
}

tr.lossy td:first-child {
  border-top-left-radius: var(--radius-small);
  border-bottom-left-radius: var(--radius-small);
}

tr.lossy td:last-child {
  border-top-right-radius: var(--radius-small);
  border-bottom-right-radius: var(--radius-small);
}

.num {
  width: 2rem;
  color: var(--text-muted);
}

.right {
  text-align: right;
}

.label-cell {
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge.active {
  background: var(--accent);
  color: var(--accent-contrast);
}

.badge.rest {
  background: var(--neutral-soft);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.duration-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.muted {
  color: var(--text-muted);
}

.danger {
  color: var(--danger);
  font-weight: 600;
}

.empty {
  text-align: center;
  padding: 1.2rem;
}
</style>
