import { LocaleCode } from '~/types/i18n'

export function useScrambleText(locale: Ref<string>) {
  let frame = 0
  const latin = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
  const cyrillic = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ0123456789'

  function scramble(target: Ref<string>, finalValue: string, duration = 360) {
    if (import.meta.server || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      target.value = finalValue
      return
    }

    cancelAnimationFrame(frame)
    const characters = locale.value === LocaleCode.Ru ? cyrillic : latin
    const start = performance.now()

    function tick(time: number) {
      const progress = Math.min(1, (time - start) / duration)
      const resolved = Math.floor(finalValue.length * progress)
      target.value = finalValue.split('').map((character, index) => {
        if (character === ' ' || index < resolved) {
          return character
        }
        return characters[Math.floor(Math.random() * characters.length)]
      }).join('')

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
      else {
        target.value = finalValue
      }
    }

    frame = requestAnimationFrame(tick)
  }

  onBeforeUnmount(() => cancelAnimationFrame(frame))

  return { scramble }
}
