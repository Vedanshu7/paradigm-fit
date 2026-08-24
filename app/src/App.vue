<script setup lang="ts">
import AppNavbar from './AppNavbar.vue';
import { loadParadigm } from '@/paradigm/infrastructure/loadParadigm';
import { provideParadigm } from '@/paradigm/ui/composables/useParadigm';
import ParadigmFitView from '@/paradigm/ui/ParadigmFitView.vue';

/** The shell: navbar and the scrollable view. */
provideParadigm(loadParadigm());
</script>

<template>
  <div class="layout">
    <div class="main">
      <AppNavbar />

      <main>
        <div class="content">
          <ParadigmFitView />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  height: 100vh;
  overflow: hidden;
}

/* The shell fills the viewport and only <main> scrolls, so the navbar stays put.
   On <main>, min-height: 0 lets it shrink below its content height; without it
   the content grows the shell and the overflow is clipped, not scrollable. */
.main {
  height: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

main {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  /* Scrollbar in the palette rather than the OS default (thumb, then track). */
  scrollbar-width: thin;
  scrollbar-color: var(--border) var(--surface);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
}

@media (max-width: 900px) {
  .layout {
    height: auto;
    overflow: visible;
  }

  .main,
  main {
    overflow: visible;
  }
}
</style>
