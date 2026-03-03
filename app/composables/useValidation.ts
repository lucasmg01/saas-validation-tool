import type { CheckpointScore, ValidationAnswers, Verdict } from '~/types/validation'

const CHECKPOINT_TITLES = [
  'Le test de la phrase unique',
  'Le filtre de la douleur',
  'Le test de frequence',
  'Le benchmark bricolage',
  'Le test du portefeuille',
  'Le canal des 10 premiers',
  'Le reality check'
]

const RECOMMENDATIONS: Record<number, string> = {
  1: 'Reformule en 1 phrase: cible + probleme + resultat promis, sans jargon.',
  2: 'Parle a 5 prospects cette semaine et liste leurs alternatives actuelles.',
  3: 'Priorise un probleme qui revient au minimum chaque semaine.',
  4: 'Mesure le temps perdu reel avec 3 interviews et exemples concrets.',
  5: 'Demande un pre-engagement concret (LOI, acompte, precommande).',
  6: 'Choisis 2 canaux actionnables et contacte 10 leads manuellement.',
  7: 'Valide tes contraintes perso et fais 10 interviews avant de coder.'
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)))
}

function normalizeTextList(rawValue: string): string[] {
  return rawValue
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 1)
}

function getStatus(score: number): CheckpointScore['status'] {
  if (score >= 80) return 'green'
  if (score >= 60) return 'yellow'
  if (score >= 40) return 'orange'
  return 'red'
}

function scoreCheckpoint1(answers: ValidationAnswers['checkpoint1']): number {
  const words = countWords(answers.problemStatement)
  if (words === 0) return 0
  if (words > 15) return 30
  if (words >= 8) return 100
  if (words >= 4) return 80
  return 55
}

function scoreCheckpoint2(answers: ValidationAnswers['checkpoint2']): number {
  const answerMap: Record<string, number> = { yes: 35, unknown: 18, no: 0, '': 0 }
  const alternativesCount = normalizeTextList(answers.alternatives).length

  const alternativesScore =
    alternativesCount >= 3 ? 30 : alternativesCount === 2 ? 20 : alternativesCount === 1 ? 10 : 0

  return clampScore(answerMap[answers.activeSearch] + answerMap[answers.spendTimeOrMoney] + alternativesScore)
}

function scoreCheckpoint3(answers: ValidationAnswers['checkpoint3']): number {
  const map: Record<string, number> = {
    several_per_day: 100,
    daily: 90,
    weekly: 75,
    monthly: 55,
    few_times_year: 35,
    rarely: 15,
    '': 0
  }
  return map[answers.frequency] ?? 0
}

function scoreCheckpoint4(answers: ValidationAnswers['checkpoint4']): number {
  const manualTools = ['excel', 'whatsapp', 'email', 'paper']
  const manualCount = answers.tools.filter((tool) => manualTools.includes(tool)).length
  const usesDedicated = answers.tools.includes('dedicated_tool')
  const usesNothing = answers.tools.includes('none')

  let toolsScore = 0
  if (manualCount >= 2) toolsScore = 70
  else if (manualCount === 1) toolsScore = 55
  else if (usesDedicated) toolsScore = 45
  else if (usesNothing) toolsScore = 30

  const hours = answers.weeklyHoursLost ?? 0
  const hoursScore = hours >= 10 ? 30 : hours >= 5 ? 20 : hours >= 2 ? 12 : hours >= 1 ? 8 : 0

  return clampScore(toolsScore + hoursScore)
}

function scoreCheckpoint5(answers: ValidationAnswers['checkpoint5']): number {
  const askedScore = answers.askedToPay === 'yes' ? 30 : 0
  const commitmentScore = answers.concreteCommitment === 'yes' ? 40 : 0

  const price = answers.estimatedPrice ?? 0
  const priceScore = price >= 50 ? 30 : price >= 20 ? 25 : price > 0 ? 15 : 0

  return clampScore(askedScore + priceScore + commitmentScore)
}

function scoreCheckpoint6(answers: ValidationAnswers['checkpoint6']): number {
  const firstTenScoreMap: Record<string, number> = { precise: 40, vague: 20, no: 0, '': 0 }
  const adsScoreMap: Record<string, number> = { yes: 30, unknown: 15, no: 0, '': 0 }
  const channelsCount = normalizeTextList(answers.channels).length
  const channelsScore = channelsCount >= 2 ? 30 : channelsCount === 1 ? 15 : 0

  return clampScore(
    firstTenScoreMap[answers.knowFirstTenClients] + adsScoreMap[answers.canReachWithoutAds] + channelsScore
  )
}

function scoreCheckpoint7(answers: ValidationAnswers['checkpoint7']): number {
  const longRunScoreMap: Record<string, number> = { yes: 40, unknown: 15, no: 0, '': 0 }
  const sixMonthsScore = answers.canSurviveSixMonths === 'yes' ? 35 : 0
  const talkedScore = answers.talkedToTenPeople === 'yes' ? 25 : 0

  return clampScore(longRunScoreMap[answers.readyForLongRun] + sixMonthsScore + talkedScore)
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
}

export function getCheckpointScores(answers: ValidationAnswers): CheckpointScore[] {
  const rawScores = [
    scoreCheckpoint1(answers.checkpoint1),
    scoreCheckpoint2(answers.checkpoint2),
    scoreCheckpoint3(answers.checkpoint3),
    scoreCheckpoint4(answers.checkpoint4),
    scoreCheckpoint5(answers.checkpoint5),
    scoreCheckpoint6(answers.checkpoint6),
    scoreCheckpoint7(answers.checkpoint7)
  ]

  return rawScores.map((score, index) => {
    const id = index + 1
    const status = getStatus(score)

    return {
      id,
      title: CHECKPOINT_TITLES[index],
      score,
      status,
      recommendation: status === 'green' || status === 'yellow' ? undefined : RECOMMENDATIONS[id]
    }
  })
}

export function getGlobalScore(checkpointScores: CheckpointScore[]): number {
  if (checkpointScores.length === 0) return 0

  const sum = checkpointScores.reduce((total, checkpoint) => total + checkpoint.score, 0)
  return clampScore(sum / checkpointScores.length)
}

export function getVerdict(globalScore: number): Verdict {
  if (globalScore >= 80) {
    return {
      label: 'Feu vert - Ton idee a du potentiel, tu peux passer au dev',
      shortLabel: 'Feu vert',
      description: 'Ton socle de validation est solide. Passe en MVP avec des objectifs de traction clairs.',
      status: 'green'
    }
  }

  if (globalScore >= 60) {
    return {
      label: 'Attention - Quelques points a valider avant de coder',
      shortLabel: 'Attention',
      description: 'Ton idee est interessante, mais des signaux critiques manquent encore pour limiter le risque.',
      status: 'yellow'
    }
  }

  if (globalScore >= 40) {
    return {
      label: "Risque - Plusieurs signaux faibles, creuse avant d'investir",
      shortLabel: 'Risque',
      description: "Les hypotheses business sont fragiles. Mieux vaut valider davantage avant d'investir du temps dev.",
      status: 'orange'
    }
  }

  return {
    label: "Stop - Ne lance pas le dev, ton idee n'est pas validee",
    shortLabel: 'Stop',
    description: 'Le niveau de risque est trop eleve a ce stade. Priorise interviews et pre-validation.',
    status: 'red'
  }
}
