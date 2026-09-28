import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useProjectReveal } from '../app/composables/useProjectReveal'

describe('project reveal', () => {
  it('opens for pointer or keyboard focus and closes when both leave', () => {
    const reveal = useProjectReveal(ref(false))
    expect(reveal.open.value).toBe(false)
    reveal.setHovered(true)
    expect(reveal.open.value).toBe(true)
    reveal.setFocusInside(true)
    reveal.setHovered(false)
    expect(reveal.open.value).toBe(true)
    reveal.setFocusInside(false)
    expect(reveal.open.value).toBe(false)
  })

  it('keeps a mobile row open after entering the reading area, but honors manual close', () => {
    const reveal = useProjectReveal(ref(true))
    reveal.markVisible()
    expect(reveal.open.value).toBe(true)
    reveal.toggle()
    expect(reveal.open.value).toBe(false)
    reveal.markVisible()
    expect(reveal.open.value).toBe(false)
    reveal.toggle()
    expect(reveal.open.value).toBe(true)
  })

  it('clears a desktop manual override after the pointer and focus leave', () => {
    const reveal = useProjectReveal(ref(false))
    reveal.setHovered(true)
    reveal.toggle()
    expect(reveal.open.value).toBe(false)
    reveal.setHovered(false)
    reveal.setHovered(true)
    expect(reveal.open.value).toBe(true)
  })
})
