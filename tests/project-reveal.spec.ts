import { describe, expect, it } from 'vitest'
import { projects } from '../app/data/projects'
import { useProjectReveal } from '../app/composables/useProjectReveal'
import { useProjectSelection } from '../app/composables/useProjectSelection'

describe('project selection', () => {
  it('starts with PowerSketch and keeps the chosen project until another is selected', () => {
    const selection = useProjectSelection(projects)
    expect(selection.selectedSlug.value).toBe('powersketch')
    selection.select('nordhus')
    expect(selection.selectedSlug.value).toBe('nordhus')
    selection.select('missing')
    expect(selection.selectedSlug.value).toBe('nordhus')
  })
})

describe('mobile project reveal', () => {
  it('opens after entering the reading area and remembers a manual close', () => {
    const reveal = useProjectReveal()
    expect(reveal.open.value).toBe(false)
    reveal.markVisible()
    expect(reveal.open.value).toBe(true)
    reveal.toggle()
    expect(reveal.open.value).toBe(false)
    reveal.markVisible()
    expect(reveal.open.value).toBe(false)
    reveal.toggle()
    expect(reveal.open.value).toBe(true)
  })
})
