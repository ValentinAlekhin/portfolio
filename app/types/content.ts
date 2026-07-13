export type ThemeName = 'system' | 'phosphor'

export interface CapabilityItem {
  id: string
  title: string
  description: string
  details: string[]
}

export interface ProcessItem {
  number: string
  title: string
  description: string
}

export interface ProjectContent {
  summary: string
  description: string
  challenge: string
  role: string
  approach: string
  architecture: string
  result: string
  constraints: string
}

export interface Project {
  slug: string
  index: string
  title: string
  period: string
  status: 'live' | 'in-progress' | 'archived'
  externalUrl: string
  translationKey: string
  stack: string[]
}
