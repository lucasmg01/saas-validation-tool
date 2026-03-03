<script setup lang="ts">
import { getCheckpointScores, getGlobalScore, getVerdict } from '~/composables/useValidation'

const validationStore = useValidationStore()
const config = useRuntimeConfig()

useSeoMeta({
  title: 'Resultat de validation SaaS | Orange Bleu',
  description: "Decouvre ton score global et les checkpoints a renforcer avant de lancer le developpement."
})

const checkpointScores = computed(() => getCheckpointScores(validationStore.answers))
const globalScore = computed(() => getGlobalScore(checkpointScores.value))
const verdict = computed(() => getVerdict(globalScore.value))

const email = ref('')
const emailStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const emailMessage = ref('')

const verdictPillClass = computed(() => {
  switch (verdict.value.status) {
    case 'green':
      return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
    case 'yellow':
      return 'border-yellow-400/30 bg-yellow-500/10 text-yellow-100'
    case 'orange':
      return 'border-orange-400/30 bg-orange-500/10 text-orange-100'
    default:
      return 'border-red-400/30 bg-red-500/10 text-red-100'
  }
})

async function restartTest(): Promise<void> {
  validationStore.reset()
  await navigateTo('/test')
}

async function sendByEmail(): Promise<void> {
  if (!email.value.trim()) {
    emailStatus.value = 'error'
    emailMessage.value = 'Ajoute une adresse email valide.'
    return
  }

  try {
    emailStatus.value = 'loading'
    emailMessage.value = ''

    const response = await $fetch<{ message: string }>('/api/send-results', {
      method: 'POST',
      body: {
        email: email.value.trim(),
        globalScore: globalScore.value,
        verdict: verdict.value,
        checkpointScores: checkpointScores.value
      }
    })

    emailStatus.value = 'success'
    emailMessage.value = response.message
  } catch {
    emailStatus.value = 'error'
    emailMessage.value = "Impossible d'envoyer l'email pour le moment."
  }
}

onMounted(() => {
  validationStore.hydrate()
})
</script>

<template>
  <main class="mx-auto min-h-screen w-full max-w-6xl px-5 py-10 sm:px-8 md:py-14">
    <section class="panel rounded-3xl p-6 md:p-10">
      <header class="grid gap-8 lg:grid-cols-[260px_1fr] lg:items-center">
        <ScoreGauge :score="globalScore" />

        <div class="space-y-4">
          <p class="text-xs uppercase tracking-[0.24em] text-cyan-300">Resultat global</p>
          <h1 class="font-display text-3xl font-bold text-white md:text-4xl">{{ verdict.label }}</h1>
          <p class="max-w-2xl text-slate-300">{{ verdict.description }}</p>
          <span class="inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" :class="verdictPillClass">
            {{ verdict.shortLabel }}
          </span>
        </div>
      </header>

      <section class="mt-10">
        <h2 class="font-display text-2xl font-semibold text-white">Detail par checkpoint</h2>
        <div class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ResultCard
            v-for="checkpoint in checkpointScores"
            :key="checkpoint.id"
            :title="checkpoint.title"
            :score="checkpoint.score"
            :recommendation="checkpoint.recommendation"
          />
        </div>
      </section>

      <section class="mt-10 rounded-2xl border border-slate-700/70 bg-slate-900/60 p-5 md:p-6">
        <h2 class="font-display text-xl font-semibold text-white">
          Tu veux qu'on t'aide a valider et developper ton SaaS ?
        </h2>

        <div class="mt-5 flex flex-wrap gap-3">
          <a
            :href="config.public.calendlyUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-90"
          >
            Prendre RDV avec Orange Bleu
          </a>

          <button
            type="button"
            class="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
            @click="restartTest"
          >
            Recommencer le test
          </button>
        </div>
      </section>

      <section class="mt-8 rounded-2xl border border-slate-700/70 bg-slate-900/50 p-5 md:p-6">
        <h2 class="font-display text-lg font-semibold text-white">Optionnel: recevoir les resultats par email</h2>

        <form class="mt-4 flex flex-col gap-3 sm:flex-row" @submit.prevent="sendByEmail">
          <label class="sr-only" for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="field w-full px-4 py-2.5 text-sm"
            placeholder="ton@email.com"
          />
          <button
            type="submit"
            class="rounded-xl border border-cyan-300/60 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200 hover:text-white disabled:opacity-60"
            :disabled="emailStatus === 'loading'"
          >
            {{ emailStatus === 'loading' ? 'Envoi...' : 'Envoyer le recap' }}
          </button>
        </form>

        <p v-if="emailMessage" class="mt-3 text-sm" :class="emailStatus === 'success' ? 'text-emerald-300' : 'text-red-300'">
          {{ emailMessage }}
        </p>
      </section>
    </section>
  </main>
</template>
