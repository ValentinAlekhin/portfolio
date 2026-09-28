import { projectPlaceholders } from '../data/projectPlaceholders.generated'

export function getProjectPlaceholder(src: string): string {
  return projectPlaceholders[src] ?? ''
}
