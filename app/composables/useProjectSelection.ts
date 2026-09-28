import { ref } from 'vue'
import type { Project } from '~/types/content'

export function useProjectSelection(projects: readonly Project[]) {
  const selectedSlug = ref(projects[0]?.slug ?? '')

  function select(slug: string) {
    if (projects.some(project => project.slug === slug)) selectedSlug.value = slug
  }

  return { selectedSlug, select }
}
