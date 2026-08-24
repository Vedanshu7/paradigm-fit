<script setup lang="ts">
/** Top bar: the product name. */
</script>

<template>
  <header class="navbar">
    <div class="titles">
      <h1>Paradigm Fit</h1>
      <p>fMRI pre-scan check</p>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 5;
  padding: 0.7rem 1.5rem;
  background: color-mix(in oklab, var(--bg) 85%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}

.titles h1 {
  margin: 0;
  font-size: 1rem;
}

.titles p {
  margin: 0;
  font-size: 0.78rem;
  color: var(--text-muted);
}
</style>
