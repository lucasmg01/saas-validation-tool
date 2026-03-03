<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    currentStep: number
    totalSteps?: number
  }>(),
  {
    totalSteps: 7
  }
)

const percentage = computed(() => {
  if (props.totalSteps <= 0) return 0
  return Math.round((props.currentStep / props.totalSteps) * 100)
})
</script>

<template>
  <div class="space-y-2" role="status" aria-live="polite">
    <div class="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
      <span>Progression</span>
      <span>Etape {{ currentStep }}/{{ totalSteps }}</span>
    </div>
    <div
      class="h-2 w-full overflow-hidden rounded-full bg-slate-800"
      role="progressbar"
      :aria-valuenow="currentStep"
      :aria-valuemin="1"
      :aria-valuemax="totalSteps"
      :aria-valuetext="`Etape ${currentStep} sur ${totalSteps}`"
    >
      <div
        class="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400 transition-all duration-500"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
