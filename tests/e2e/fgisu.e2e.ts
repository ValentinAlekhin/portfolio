import { expect, test } from '@playwright/test'
import { LocaleCode } from '../../app/types/i18n'
import en from '../../i18n/locales/en.json' with { type: 'json' }
import ru from '../../i18n/locales/ru.json' with { type: 'json' }

const translations = { [LocaleCode.Ru]: ru, [LocaleCode.En]: en }
test.use({ hasTouch: true })

for (const locale of Object.values(LocaleCode)) {
  for (const width of [320, 390, 899, 900, 1100, 1440]) {
    test(`${locale} / ${width}: FGISU diagrams fit their frames and remain accessible`, async ({
      page,
    }) => {
      const copy = translations[locale]
      const prefix = locale === LocaleCode.Ru ? '' : '/en'
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', message => {
        if (/hydration/i.test(message.text())) errors.push(message.text())
      })
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`${prefix}/projects/fgisu/`)
      await page.waitForFunction(() => {
        const browser = window as Window & { useNuxtApp?: () => { isHydrating: boolean } }
        return browser.useNuxtApp?.().isHydrating === false
      })
      await expect(page.locator('.project-case__top > span')).toHaveText('2022—2024')
      const diagram = page.getByRole('group', {
        name: copy.projects.entries.fgisu.diagram.systemLabel,
      })
      await expect(diagram.locator('[data-domain-color]')).toHaveCount(8)
      await expect(diagram.locator('.vue-flow__edge-path').first()).toHaveAttribute('d', /^M/)
      await expect
        .poll(() =>
          diagram.evaluate(root => {
            const frame = root.getBoundingClientRect()
            return Array.from(root.querySelectorAll('.vue-flow__node, .vue-flow__edge-path'))
              .filter(element => {
                const bounds = element.getBoundingClientRect()
                return (
                  bounds.left < frame.left + 2 ||
                  bounds.right > frame.right - 2 ||
                  bounds.top < frame.top + 2 ||
                  bounds.bottom > frame.bottom - 2
                )
              })
              .map(element => element.getAttribute('data-id') ?? element.id ?? element.tagName)
          }),
        )
        .toEqual([])
      const processes = diagram.getByRole('button', {
        name: copy.projects.entries.fgisu.diagram.nodes.zeebe.title,
        exact: true,
      })
      await processes.focus()
      await page.keyboard.press('Enter')
      const popup = page.getByRole('dialog', {
        name: copy.projects.entries.fgisu.diagram.nodes.zeebe.title,
      })
      await expect(popup).toContainText(copy.projects.entries.fgisu.diagram.nodes.zeebe.detail)
      await page.keyboard.press('Escape')
      await expect(popup).toBeHidden()
      await expect(processes).toBeFocused()
      await processes.tap()
      await expect(popup).toBeVisible()
      await popup.getByRole('button', { name: copy.projects.entries.fgisu.diagram.close }).click()
      await expect(popup).toBeHidden()

      const request = page
        .locator('.project-screenshot')
        .filter({ hasText: copy.projects.entries.fgisu.media.request.caption })
      await request.locator('.project-screenshot__image-trigger').click()
      const gallery = page.getByRole('dialog', { name: copy.case.gallery.title })
      await expect(gallery).toBeVisible()
      const image = gallery.locator(
        '.pswp__item[aria-hidden="false"] .pswp__img:not(.pswp__img--placeholder)',
      )
      await expect(image).toHaveAttribute('src', '/projects/fgisu/request-demo.webp')
      await expect(image).toHaveAttribute('alt', copy.projects.entries.fgisu.media.request.alt)
      await page.keyboard.press('Escape')
      await expect(gallery).toBeHidden()
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBe(true)
      expect(errors).toEqual([])
    })
  }
}
