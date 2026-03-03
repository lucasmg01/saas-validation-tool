<script setup lang="ts">
const props = defineProps<{
  score: number
}>()

const animatedScore = ref(0)

const gaugeColor = computed(() => {
  if (animatedScore.value >= 80) return '#22c55e'
  if (animatedScore.value >= 60) return '#eab308'
  if (animatedScore.value >= 40) return '#f97316'
  return '#ef4444'
})

const gaugeStyle = computed(() => {
  const progress = Math.min(100, Math.max(0, animatedScore.value))
  return {
    background: `conic-gradient(${gaugeColor.value} ${progress * 3.6}deg, #1e293b ${progress * 3.6}deg)`
  }
})

onMounted(() => {
  const start = performance.now()
  const duration = 900

  const step = (now: number) => {
    const elapsed = now - start
    const ratio = Math.min(1, elapsed / duration)
    animatedScore.value = Math.round(props.score * ratio)

    if (ratio < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
})

watch(
  () => props.score,
  (nextScore) => {
    if (!import.meta.client) {
      animatedScore.value = nextScore
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="relative mx-auto h-48 w-48 md:h-56 md:w-56" :aria-label="`Score global ${animatedScore} sur 100`" role="img">
    <div class="absolute inset-0 rounded-full p-2 transition-all duration-700" :style="gaugeStyle">
      <div class="flex h-full w-full items-center justify-center rounded-full bg-slate-950/95 shadow-[0_0_60px_rgba(2,132,199,0.2)]">
        <div class="text-center">
          <p class="text-4xl font-extrabold text-white md:text-5xl">{{ animatedScore }}</p>
          <p class="text-xs uppercase tracking-[0.22em] text-slate-400">/100</p>
        </div>
      </div>
    </div>
  </div>
</template>
