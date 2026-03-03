export type TernaryAnswer = 'yes' | 'no' | 'unknown' | ''
export type BinaryAnswer = 'yes' | 'no' | ''

export type FrequencyOption =
  | 'several_per_day'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'few_times_year'
  | 'rarely'
  | ''

export type ToolOption =
  | 'excel'
  | 'whatsapp'
  | 'email'
  | 'paper'
  | 'dedicated_tool'
  | 'none'
  | 'other'

export type ChannelKnowledge = 'precise' | 'vague' | 'no' | ''

export interface ValidationAnswers {
  checkpoint1: {
    problemStatement: string
  }
  checkpoint2: {
    activeSearch: TernaryAnswer
    spendTimeOrMoney: TernaryAnswer
    alternatives: string
  }
  checkpoint3: {
    frequency: FrequencyOption
  }
  checkpoint4: {
    tools: ToolOption[]
    weeklyHoursLost: number | null
  }
  checkpoint5: {
    askedToPay: BinaryAnswer
    estimatedPrice: number | null
    concreteCommitment: BinaryAnswer
  }
  checkpoint6: {
    knowFirstTenClients: ChannelKnowledge
    canReachWithoutAds: TernaryAnswer
    channels: string
  }
  checkpoint7: {
    readyForLongRun: TernaryAnswer
    canSurviveSixMonths: BinaryAnswer
    talkedToTenPeople: BinaryAnswer
  }
}

export interface CheckpointScore {
  id: number
  title: string
  score: number
  status: 'green' | 'yellow' | 'orange' | 'red'
  recommendation?: string
}

export interface Verdict {
  label: string
  shortLabel: string
  description: string
  status: 'green' | 'yellow' | 'orange' | 'red'
}

export const TOTAL_CHECKPOINTS = 7
