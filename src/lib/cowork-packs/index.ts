export interface SkillCard {
  title: string
  description: string
}

export interface CoworkPack {
  id: 'financial-advisor' | 'attorney' | 'executive'
  label: string
  customInstructions: string
  skillCards: SkillCard[]
  workflows: string[]
  connectors: string[]
  folderStructure: string[]
}

export const VALID_PROFESSIONS = ['financial-advisor', 'attorney', 'executive'] as const
export type ProfessionId = (typeof VALID_PROFESSIONS)[number]

// Registry — import the individual pack modules
import { financialAdvisorPack } from './financial-advisor'
import { attorneyPack } from './attorney'
import { executivePack } from './executive'

export const packRegistry: Record<ProfessionId, CoworkPack> = {
  'financial-advisor': financialAdvisorPack,
  attorney: attorneyPack,
  executive: executivePack,
}
