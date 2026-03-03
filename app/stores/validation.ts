import type { ValidationAnswers } from '~/types/validation'

const STORAGE_KEY = 'orange-bleu-saas-validation-v1'

function createDefaultAnswers(): ValidationAnswers {
  return {
    checkpoint1: {
      problemStatement: ''
    },
    checkpoint2: {
      activeSearch: '',
      spendTimeOrMoney: '',
      alternatives: ''
    },
    checkpoint3: {
      frequency: ''
    },
    checkpoint4: {
      tools: [],
      weeklyHoursLost: null
    },
    checkpoint5: {
      askedToPay: '',
      estimatedPrice: null,
      concreteCommitment: ''
    },
    checkpoint6: {
      knowFirstTenClients: '',
      canReachWithoutAds: '',
      channels: ''
    },
    checkpoint7: {
      readyForLongRun: '',
      canSurviveSixMonths: '',
      talkedToTenPeople: ''
    }
  }
}

function safeJsonParse(value: string | null): { answers?: ValidationAnswers; currentStep?: number } | null {
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export const useValidationStore = defineStore('validation', {
  state: () => ({
    answers: createDefaultAnswers(),
    currentStep: 1,
    hydrated: false
  }),
  getters: {
    isComplete(state): boolean {
      return Boolean(
        state.answers.checkpoint1.problemStatement.trim() &&
          state.answers.checkpoint2.activeSearch &&
          state.answers.checkpoint2.spendTimeOrMoney &&
          state.answers.checkpoint3.frequency &&
          state.answers.checkpoint4.weeklyHoursLost !== null &&
          state.answers.checkpoint5.askedToPay &&
          state.answers.checkpoint5.concreteCommitment &&
          state.answers.checkpoint6.knowFirstTenClients &&
          state.answers.checkpoint6.canReachWithoutAds &&
          state.answers.checkpoint7.readyForLongRun &&
          state.answers.checkpoint7.canSurviveSixMonths &&
          state.answers.checkpoint7.talkedToTenPeople
      )
    }
  },
  actions: {
    hydrate(): void {
      if (!import.meta.client || this.hydrated) return

      const parsed = safeJsonParse(localStorage.getItem(STORAGE_KEY))
      if (!parsed) {
        this.hydrated = true
        return
      }

      this.answers = {
        ...createDefaultAnswers(),
        ...(parsed.answers || {})
      }

      const step = Number(parsed.currentStep)
      this.currentStep = Number.isFinite(step) && step >= 1 && step <= 7 ? step : 1
      this.hydrated = true
    },
    persist(): void {
      if (!import.meta.client) return

      const payload = {
        answers: this.answers,
        currentStep: this.currentStep
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    },
    setCurrentStep(step: number): void {
      this.currentStep = Math.min(7, Math.max(1, step))
      this.persist()
    },
    reset(): void {
      this.answers = createDefaultAnswers()
      this.currentStep = 1
      this.persist()
    }
  }
})
