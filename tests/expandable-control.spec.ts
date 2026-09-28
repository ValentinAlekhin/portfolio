import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, reactive, ref, type EffectScope, type Ref } from 'vue'
import { useExpandableControl } from '../app/composables/useExpandableControl'

vi.mock('@vueuse/core', () => ({ onClickOutside: vi.fn() }))

describe('expandable header control', () => {
  let scope: EffectScope
  let route: { fullPath: string }
  let nextId: number
  let sharedState: Map<string, Ref<unknown>>

  beforeEach(() => {
    scope = effectScope()
    route = reactive({ fullPath: '/' })
    nextId = 0
    sharedState = new Map()
    vi.stubGlobal('useId', () => `control-${++nextId}`)
    vi.stubGlobal('useRoute', () => route)
    vi.stubGlobal('useState', <T>(key: string, create: () => T) => {
      if (!sharedState.has(key)) sharedState.set(key, ref(create()))
      return sharedState.get(key) as Ref<T>
    })
  })

  afterEach(() => {
    scope.stop()
    vi.unstubAllGlobals()
  })

  function createControl() {
    const control = scope.run(() => useExpandableControl())
    if (!control) throw new Error('Control scope did not start')
    return control
  }

  it('opens on mouse hover, closes on exit, and keeps only one control open', () => {
    const theme = createControl()
    const locale = createControl()
    theme.onPointerEnter({ pointerType: 'mouse' } as PointerEvent)
    expect(theme.isOpen.value).toBe(true)

    locale.onPointerEnter({ pointerType: 'mouse' } as PointerEvent)
    expect(locale.isOpen.value).toBe(true)
    expect(theme.isOpen.value).toBe(false)

    locale.onPointerLeave({ pointerType: 'mouse' } as PointerEvent)
    expect(locale.isOpen.value).toBe(false)
  })

  it('opens by touch and closes after a touch selection with focus restored', async () => {
    const control = createControl()
    const focus = vi.fn()
    control.trigger.value = { focus } as unknown as HTMLButtonElement

    control.onTriggerClick({ detail: 1, pointerType: 'touch' } as unknown as MouseEvent)
    expect(control.isOpen.value).toBe(true)
    control.onSelection({ detail: 1, pointerType: 'touch' } as unknown as MouseEvent)
    await nextTick()
    expect(control.isOpen.value).toBe(false)
    expect(focus).toHaveBeenCalledOnce()
  })

  it('focuses an option from the keyboard and returns focus on Escape', async () => {
    const control = createControl()
    const optionFocus = vi.fn()
    const triggerFocus = vi.fn()
    control.root.value = {
      querySelectorAll: () => [{ focus: optionFocus }],
    } as unknown as HTMLElement
    control.trigger.value = { focus: triggerFocus } as unknown as HTMLButtonElement

    await control.focusOption()
    expect(control.isOpen.value).toBe(true)
    expect(optionFocus).toHaveBeenCalledOnce()

    const preventDefault = vi.fn()
    control.onEscape({ preventDefault } as unknown as KeyboardEvent)
    await nextTick()
    expect(control.isOpen.value).toBe(false)
    expect(triggerFocus).toHaveBeenCalledOnce()
    expect(preventDefault).toHaveBeenCalledOnce()
  })

  it('preserves an open control when keyboard focus follows hover', () => {
    const control = createControl()
    control.onPointerEnter({ pointerType: 'mouse' } as PointerEvent)
    control.onKeyboardIntent()
    control.onPointerLeave({ pointerType: 'mouse' } as PointerEvent)
    expect(control.isOpen.value).toBe(true)
    control.onFocusOut({ relatedTarget: null } as FocusEvent)
    expect(control.isOpen.value).toBe(false)
  })

  it('closes on route change after following a language link', async () => {
    const control = createControl()
    control.onPointerEnter({ pointerType: 'mouse' } as PointerEvent)
    route.fullPath = '/en/'
    await nextTick()
    expect(control.isOpen.value).toBe(false)
  })
})
