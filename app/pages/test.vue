<script setup lang="ts">
import { countWords } from '~/composables/useValidation'
import type { FrequencyOption, ToolOption } from '~/types/validation'

const validationStore = useValidationStore()

useSeoMeta({
  title: 'Test de validation SaaS | Orange Bleu',
  description: '7 checkpoints pour valider ton idee SaaS avant de developper.'
})

const checkpoints = [
  {
    title: 'Le test de la phrase unique',
    subtitle: 'Formule ton probleme en une phrase claire et concrete.'
  },
  {
    title: 'Le filtre de la douleur',
    subtitle: 'Valide que ton marche ressent vraiment ce probleme.'
  },
  {
    title: 'Le test de frequence',
    subtitle: 'Plus le probleme est frequent, plus la valeur est evidente.'
  },
  {
    title: 'Le benchmark bricolage',
    subtitle: 'Observe les contournements actuels et le temps perdu.'
  },
  {
    title: 'Le test du portefeuille',
    subtitle: 'Confirme la volonte de payer avec des signaux concrets.'
  },
  {
    title: 'Le canal des 10 premiers',
    subtitle: 'Un canal d acquisition clair est un avantage decisif.'
  },
  {
    title: 'Le reality check',
    subtitle: 'Aligne la realite business avec ton engagement personnel.'
  }
]

const step = computed(() => validationStore.currentStep)
const totalSteps = checkpoints.length

const currentCheckpoint = computed(() => checkpoints[step.value - 1])
const checkpoint1WordCount = computed(() => countWords(validationStore.answers.checkpoint1.problemStatement))

const frequencyOptions: Array<{ label: string; value: FrequencyOption }> = [
  { label: 'Plusieurs fois par jour', value: 'several_per_day' },
  { label: 'Chaque jour', value: 'daily' },
  { label: 'Chaque semaine', value: 'weekly' },
  { label: 'Chaque mois', value: 'monthly' },
  { label: 'Quelques fois par an', value: 'few_times_year' },
  { label: 'Rarement', value: 'rarely' }
]

const tools: Array<{ label: string; value: ToolOption }> = [
  { label: 'Excel', value: 'excel' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Email', value: 'email' },
  { label: 'Papier', value: 'paper' },
  { label: 'Outil dedie', value: 'dedicated_tool' },
  { label: 'Rien', value: 'none' },
  { label: 'Autre', value: 'other' }
]

function listCount(input: string): number {
  return input
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 1).length
}

const canGoNext = computed(() => {
  const answers = validationStore.answers

  switch (step.value) {
    case 1:
      return Boolean(answers.checkpoint1.problemStatement.trim())
    case 2:
      return Boolean(
        answers.checkpoint2.activeSearch &&
          answers.checkpoint2.spendTimeOrMoney &&
          listCount(answers.checkpoint2.alternatives) > 0
      )
    case 3:
      return Boolean(answers.checkpoint3.frequency)
    case 4:
      return answers.checkpoint4.tools.length > 0 && answers.checkpoint4.weeklyHoursLost !== null
    case 5:
      return Boolean(
        answers.checkpoint5.askedToPay &&
          answers.checkpoint5.concreteCommitment &&
          answers.checkpoint5.estimatedPrice !== null
      )
    case 6:
      return Boolean(
        answers.checkpoint6.knowFirstTenClients &&
          answers.checkpoint6.canReachWithoutAds &&
          listCount(answers.checkpoint6.channels) > 0
      )
    case 7:
      return Boolean(
        answers.checkpoint7.readyForLongRun &&
          answers.checkpoint7.canSurviveSixMonths &&
          answers.checkpoint7.talkedToTenPeople
      )
    default:
      return false
  }
})

function goPrevious(): void {
  validationStore.setCurrentStep(step.value - 1)
}

async function goNext(): Promise<void> {
  if (!canGoNext.value) return

  if (step.value < totalSteps) {
    validationStore.setCurrentStep(step.value + 1)
    return
  }

  await navigateTo('/results')
}

onMounted(() => {
  validationStore.hydrate()
})
</script>

<template>
  <main class="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-10 sm:px-8 md:py-14">
    <ProgressBar :current-step="step" :total-steps="totalSteps" class="mb-8" />

    <Transition name="step" mode="out-in">
      <section :key="step" class="panel rounded-3xl p-6 md:p-10">
        <CheckpointCard :step="step" :title="currentCheckpoint.title" :subtitle="currentCheckpoint.subtitle" />

        <div class="mt-8 space-y-6">
          <template v-if="step === 1">
            <label class="block text-sm font-medium text-slate-200" for="problem">
              Decris le probleme que tu resous en une seule phrase (max 15 mots)
            </label>
            <textarea
              id="problem"
              v-model="validationStore.answers.checkpoint1.problemStatement"
              rows="4"
              maxlength="180"
              class="field mt-2 p-3"
              placeholder="Ex: Les agences perdent des leads car leurs relances ne sont pas structurees."
            />
            <div class="flex items-center justify-between text-xs">
              <p :class="checkpoint1WordCount > 15 ? 'text-red-300' : 'text-slate-400'">
                {{ checkpoint1WordCount }} / 15 mots
              </p>
              <p v-if="checkpoint1WordCount > 15" class="font-semibold text-red-300">
                Trop complexe, simplifie.
              </p>
            </div>
          </template>

          <template v-else-if="step === 2">
            <fieldset class="space-y-3">
              <legend class="text-sm font-medium text-slate-200">
                Ta cible cherche-t-elle DEJA activement une solution a ce probleme ?
              </legend>
              <div class="grid gap-2 sm:grid-cols-3">
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint2.activeSearch" type="radio" value="yes" class="mr-2" />Oui</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint2.activeSearch" type="radio" value="no" class="mr-2" />Non</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint2.activeSearch" type="radio" value="unknown" class="mr-2" />Je ne sais pas</label>
              </div>
            </fieldset>

            <fieldset class="space-y-3">
              <legend class="text-sm font-medium text-slate-200">
                Depense-t-elle deja de l'argent ou du temps pour le resoudre ?
              </legend>
              <div class="grid gap-2 sm:grid-cols-3">
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint2.spendTimeOrMoney" type="radio" value="yes" class="mr-2" />Oui</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint2.spendTimeOrMoney" type="radio" value="no" class="mr-2" />Non</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint2.spendTimeOrMoney" type="radio" value="unknown" class="mr-2" />Je ne sais pas</label>
              </div>
            </fieldset>

            <label class="block text-sm font-medium text-slate-200" for="alternatives">
              Peux-tu citer 3 solutions alternatives qu'ils utilisent aujourd'hui ?
            </label>
            <textarea
              id="alternatives"
              v-model="validationStore.answers.checkpoint2.alternatives"
              rows="4"
              class="field p-3"
              placeholder="Ex: Notion, Excel, agence freelance"
            />
          </template>

          <template v-else-if="step === 3">
            <fieldset class="space-y-3">
              <legend class="text-sm font-medium text-slate-200">
                A quelle frequence ta cible rencontre ce probleme ?
              </legend>
              <div class="grid gap-2">
                <label
                  v-for="option in frequencyOptions"
                  :key="option.value"
                  class="field cursor-pointer p-3 text-sm"
                >
                  <input
                    v-model="validationStore.answers.checkpoint3.frequency"
                    type="radio"
                    :value="option.value"
                    class="mr-2"
                  />
                  {{ option.label }}
                </label>
              </div>
            </fieldset>
          </template>

          <template v-else-if="step === 4">
            <fieldset class="space-y-3">
              <legend class="text-sm font-medium text-slate-200">
                Quels outils utilisent-ils aujourd'hui pour gerer ce probleme ?
              </legend>
              <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <label v-for="tool in tools" :key="tool.value" class="field cursor-pointer p-3 text-sm">
                  <input
                    v-model="validationStore.answers.checkpoint4.tools"
                    type="checkbox"
                    :value="tool.value"
                    class="mr-2"
                  />
                  {{ tool.label }}
                </label>
              </div>
            </fieldset>

            <div>
              <label class="mb-3 block text-sm font-medium text-slate-200" for="hours">
                Combien de temps perdent-ils par semaine a cause de ce probleme ?
              </label>
              <input
                id="hours"
                v-model.number="validationStore.answers.checkpoint4.weeklyHoursLost"
                type="range"
                min="0"
                max="20"
                step="1"
                class="field h-2 cursor-pointer appearance-none p-0"
              />
              <p class="mt-2 text-sm text-slate-300">
                {{ validationStore.answers.checkpoint4.weeklyHoursLost ?? 0 }}h / semaine
              </p>
            </div>
          </template>

          <template v-else-if="step === 5">
            <fieldset class="space-y-3">
              <legend class="text-sm font-medium text-slate-200">
                As-tu deja demande a quelqu'un s'il paierait pour ta solution ?
              </legend>
              <div class="grid gap-2 sm:grid-cols-2">
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint5.askedToPay" type="radio" value="yes" class="mr-2" />Oui</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint5.askedToPay" type="radio" value="no" class="mr-2" />Non</label>
              </div>
            </fieldset>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-200" for="price">
                Combien seraient-ils prets a payer selon toi ?
              </label>
              <div class="flex items-center gap-2">
                <input
                  id="price"
                  v-model.number="validationStore.answers.checkpoint5.estimatedPrice"
                  type="number"
                  min="0"
                  step="1"
                  class="field p-3"
                  placeholder="49"
                />
                <span class="text-sm text-slate-300">EUR/mois</span>
              </div>
            </div>

            <fieldset class="space-y-3">
              <legend class="text-sm font-medium text-slate-200">
                As-tu obtenu un engagement concret (pre-commande, LOI, paiement) ?
              </legend>
              <div class="grid gap-2 sm:grid-cols-2">
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint5.concreteCommitment" type="radio" value="yes" class="mr-2" />Oui</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint5.concreteCommitment" type="radio" value="no" class="mr-2" />Non</label>
              </div>
            </fieldset>
          </template>

          <template v-else-if="step === 6">
            <fieldset class="space-y-3">
              <legend class="text-sm font-medium text-slate-200">Sais-tu ou trouver tes 10 premiers clients ?</legend>
              <div class="grid gap-2">
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint6.knowFirstTenClients" type="radio" value="precise" class="mr-2" />Oui, precisement</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint6.knowFirstTenClients" type="radio" value="vague" class="mr-2" />Vaguement</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint6.knowFirstTenClients" type="radio" value="no" class="mr-2" />Non</label>
              </div>
            </fieldset>

            <fieldset class="space-y-3">
              <legend class="text-sm font-medium text-slate-200">Peux-tu les atteindre sans budget pub ?</legend>
              <div class="grid gap-2 sm:grid-cols-3">
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint6.canReachWithoutAds" type="radio" value="yes" class="mr-2" />Oui</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint6.canReachWithoutAds" type="radio" value="no" class="mr-2" />Non</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint6.canReachWithoutAds" type="radio" value="unknown" class="mr-2" />Je ne sais pas</label>
              </div>
            </fieldset>

            <label class="block text-sm font-medium text-slate-200" for="channels">
              Cite 2 canaux concrets pour les atteindre
            </label>
            <textarea
              id="channels"
              v-model="validationStore.answers.checkpoint6.channels"
              rows="3"
              class="field p-3"
              placeholder="Ex: Groupes LinkedIn, email outbound cible"
            />
          </template>

          <template v-else>
            <fieldset class="space-y-3">
              <legend class="text-sm font-medium text-slate-200">
                Es-tu pret a bosser sur ce projet pendant 18-24 mois minimum ?
              </legend>
              <div class="grid gap-2 sm:grid-cols-3">
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint7.readyForLongRun" type="radio" value="yes" class="mr-2" />Oui</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint7.readyForLongRun" type="radio" value="no" class="mr-2" />Non</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint7.readyForLongRun" type="radio" value="unknown" class="mr-2" />Je ne sais pas</label>
              </div>
            </fieldset>

            <fieldset class="space-y-3">
              <legend class="text-sm font-medium text-slate-200">Peux-tu tenir 6 mois sans revenu de ce projet ?</legend>
              <div class="grid gap-2 sm:grid-cols-2">
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint7.canSurviveSixMonths" type="radio" value="yes" class="mr-2" />Oui</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint7.canSurviveSixMonths" type="radio" value="no" class="mr-2" />Non</label>
              </div>
            </fieldset>

            <fieldset class="space-y-3">
              <legend class="text-sm font-medium text-slate-200">
                As-tu deja parle a au moins 10 personnes de ta cible ?
              </legend>
              <div class="grid gap-2 sm:grid-cols-2">
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint7.talkedToTenPeople" type="radio" value="yes" class="mr-2" />Oui</label>
                <label class="field cursor-pointer p-3 text-sm"><input v-model="validationStore.answers.checkpoint7.talkedToTenPeople" type="radio" value="no" class="mr-2" />Non</label>
              </div>
            </fieldset>
          </template>
        </div>

        <footer class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6">
          <button
            type="button"
            class="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="step === 1"
            @click="goPrevious"
          >
            Precedent
          </button>

          <button
            type="button"
            class="rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!canGoNext"
            @click="goNext"
          >
            {{ step === totalSteps ? 'Voir les resultats' : 'Suivant' }}
          </button>
        </footer>
      </section>
    </Transition>
  </main>
</template>

<style scoped>
.step-enter-active,
.step-leave-active {
  transition: all 0.25s ease;
}

.step-enter-from {
  opacity: 0;
  transform: translateX(18px);
}

.step-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}
</style>
