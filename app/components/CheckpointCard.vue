<script setup lang="ts">
defineProps<{
  step: number
  title: string
  subtitle: string
}>()
</script>

<template>
  <header class="space-y-3">
    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">Checkpoint {{ step }}</p>
    <h1 class="text-2xl font-semibold text-white md:text-3xl">{{ title }}</h1>
    <p class="text-sm text-slate-300 md:text-base">{{ subtitle }}</p>
  </header>
</template>
