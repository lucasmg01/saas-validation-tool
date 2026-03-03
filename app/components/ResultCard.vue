<script setup lang="ts">
const props = defineProps<{
  title: string
  score: number
  recommendation?: string
}>()

const statusClass = computed(() => {
  if (props.score >= 80) return 'border-emerald-400/40 bg-emerald-500/10'
  if (props.score >= 60) return 'border-yellow-400/40 bg-yellow-500/10'
  if (props.score >= 40) return 'border-orange-400/40 bg-orange-500/10'
  return 'border-red-400/40 bg-red-500/10'
})

const statusLabel = computed(() => {
  if (props.score >= 80) return 'Valide'
  if (props.score >= 60) return 'A confirmer'
  if (props.score >= 40) return 'Fragile'
  return 'Critique'
})
</script>

<template>
  <article class="rounded-2xl border p-5" :class="statusClass">
    <div class="mb-3 flex items-center justify-between gap-3">
      <h3 class="text-sm font-semibold text-white md:text-base">{{ title }}</h3>
      <div class="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-xs font-semibold text-slate-200">
        {{ score }}/100
      </div>
    </div>

    <p class="mb-2 text-xs uppercase tracking-[0.18em] text-slate-300">{{ statusLabel }}</p>

    <p v-if="recommendation" class="text-sm text-slate-200">
      <span class="font-semibold text-white">Recommandation:</span> {{ recommendation }}
    </p>
    <p v-else class="text-sm text-slate-200">Checkpoint solide, conserve ce niveau de validation.</p>
  </article>
</template>
