interface TransitionRect {
  top: number
  left: number
  width: number
  height: number
}

interface ProjectTransitionState {
  active: boolean
  phase: 'idle' | 'cover' | 'reveal'
  rect: TransitionRect | null
}

export function usePageTransition() {
  const state = useState<ProjectTransitionState>('project-transition', () => ({
    active: false,
    phase: 'idle',
    rect: null,
  }))

  async function openProject(path: string, element: HTMLElement) {
    if (state.value.active) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      await navigateTo(path)
      return
    }

    const rect = element.getBoundingClientRect()
    state.value = {
      active: true,
      phase: 'cover',
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    }
    await new Promise(resolve => setTimeout(resolve, 420))
    await navigateTo(path)
    window.scrollTo(0, 0)
    state.value = { ...state.value, phase: 'reveal' }
    window.setTimeout(() => {
      state.value = { active: false, phase: 'idle', rect: null }
    }, 420)
  }

  return { state: readonly(state), openProject }
}
