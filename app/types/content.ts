export type LocaleCode = 'ru' | 'en'
export type ThemeName = 'system' | 'phosphor'

export interface NavigationItem {
  id: 'projects' | 'services' | 'process' | 'about'
  label: string
}

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

export interface LocalizedText {
  ru: string
  en: string
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
  roles: string[]
  stack: string[]
  content: Record<LocaleCode, ProjectContent>
}

export interface PortfolioCopy {
  seo: {
    title: string
    description: string
    ogImage: string
  }
  nav: {
    label: string
    items: NavigationItem[]
    contact: string
    open: string
    close: string
    language: string
    theme: string
  }
  hero: {
    eyebrow: string
    name: [string, string]
    statement: string
    description: string
    terminal: string
    primary: string
    secondary: string
    available: string
    experience: string
  }
  projects: {
    eyebrow: string
    title: string
    description: string
    roleLabel: string
    openCase: string
  }
  capabilities: {
    eyebrow: string
    title: string
    description: string
    items: CapabilityItem[]
  }
  process: {
    eyebrow: string
    title: string
    description: string
    items: ProcessItem[]
  }
  about: {
    eyebrow: string
    title: string
    paragraphs: string[]
    principlesLabel: string
    principles: string[]
    now: Array<{ label: string, value: string }>
  }
  contact: {
    eyebrow: string
    title: string
    description: string
    write: string
    copy: string
    copied: string
    dialogTitle: string
    dialogDescription: string
    compose: string
    close: string
  }
  footer: {
    role: string
    backToTop: string
  }
  case: {
    back: string
    live: string
    labels: Record<'context' | 'problem' | 'role' | 'approach' | 'interactions' | 'architecture' | 'result' | 'stack' | 'next', string>
    interactionItems: Array<{ title: string, description: string }>
    nextTitle: string
    nextText: string
  }
  notFound: {
    title: string
    text: string
    action: string
  }
}
