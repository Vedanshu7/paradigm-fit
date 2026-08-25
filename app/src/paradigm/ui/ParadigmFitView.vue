<script setup lang="ts">
import BlockTable from '@/paradigm/ui/table/BlockTable.vue';
import ParadigmTimeline from '@/paradigm/ui/timeline/ParadigmTimeline.vue';
import FitVerdict from '@/paradigm/ui/verdict/FitVerdict.vue';

/** The single screen: verdict, timeline, then the editable block table. */
</script>

<template>
  <FitVerdict />
  <ParadigmTimeline />
  <BlockTable />
</template>
