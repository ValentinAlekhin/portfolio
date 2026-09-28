import { onClickOutside } from '@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'

export function useExpandableControl() {
  const id = useId()
  const route = useRoute()
  const activeId = useState<string | null>('expanded-header-control', () => null)
  const root = ref<HTMLElement | null>(null)
  const trigger = ref<HTMLButtonElement | null>(null)
  const isOpen = computed(() => activeId.value === id)
  const pointerInside = ref(false)
  const keyboardActive = ref(false)

  function open() {
    activeId.value = id
  }

  function close(restoreFocus = false) {
    if (isOpen.value) activeId.value = null
    keyboardActive.value = false
    if (restoreFocus) nextTick(() => trigger.value?.focus())
  }

  function onPointerEnter(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return
    pointerInside.value = true
    open()
  }

  function onPointerLeave(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return
    pointerInside.value = false
    if (!keyboardActive.value) {
      const optionFocused = Boolean(root.value?.querySelector('[data-control-option]:focus'))
      close(optionFocused)
    }
  }

  function onFocusOut(event: FocusEvent) {
    if (root.value?.contains(event.relatedTarget as Node | null)) return
    keyboardActive.value = false
    if (!pointerInside.value) close()
  }

  function onTriggerClick(event: MouseEvent) {
    if (event.detail === 0) keyboardActive.value = true
    if ('pointerType' in event && event.pointerType === 'mouse' && pointerInside.value) return
    if (isOpen.value) close()
    else open()
  }

  function onKeyboardIntent() {
    keyboardActive.value = true
  }

  async function focusOption(index = 0) {
    keyboardActive.value = true
    open()
    await nextTick()
    const options = root.value?.querySelectorAll<HTMLElement>('[data-control-option]')
    options?.[index]?.focus()
  }

  function onEscape(event: KeyboardEvent) {
    if (!isOpen.value) return
    event.preventDefault()
    close(true)
  }

  function onSelection(event: MouseEvent) {
    if (!('pointerType' in event) || event.pointerType !== 'mouse') close(true)
    else nextTick(() => trigger.value?.focus())
  }

  onClickOutside(root, () => close())
  watch(() => route.fullPath, () => close())

  return {
    id,
    root,
    trigger,
    isOpen,
    close,
    onPointerEnter,
    onPointerLeave,
    onFocusOut,
    onTriggerClick,
    onKeyboardIntent,
    focusOption,
    onEscape,
    onSelection,
  }
}
