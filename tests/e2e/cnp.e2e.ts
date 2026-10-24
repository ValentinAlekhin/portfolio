import { expect, test } from '@playwright/test'
import { LocaleCode } from '../../app/types/i18n'
import en from '../../i18n/locales/en.json' with { type: 'json' }
import ru from '../../i18n/locales/ru.json' with { type: 'json' }

const translations = { [LocaleCode.Ru]: ru, [LocaleCode.En]: en }
test.use({ hasTouch: true })

for (const locale of Object.values(LocaleCode)) {
  for (const width of [390, 1440]) {
    test(`${locale} / ${width}: CNP explains the system and opens accessible diagram details`, async ({ page }) => {
      const copy = translations[locale]
      const home = locale === LocaleCode.Ru ? '/' : '/en/'
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', (message) => {
        if (/hydration/i.test(message.text())) errors.push(message.text())
      })
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' })
      await page.context().addCookies([{ name: 'i18n_redirected', value: locale, url: 'http://127.0.0.1:3000' }])
      await page.goto(home)
      const firstProject = width >= 1200 ? page.locator('.project-selector').first() : page.locator('.project-row h3 a').first()
      await expect(firstProject).toContainText('CNP')
      await firstProject.click()
      await expect(page).toHaveURL(new RegExp(`${home}projects/cnp/$`))
      await page.waitForFunction(() => {
        const browser = window as Window & { useNuxtApp?: () => { isHydrating: boolean } }
        return browser.useNuxtApp?.().isHydrating === false
      })
      await expect(page.locator('.project-case__top > span')).toHaveText('2021—2024')
      await expect(page.locator('.project-case__intro').first()).toHaveText(copy.projects.entries.cnp.description)
      await expect(page.locator('.architecture-diagram')).toHaveCount(2)
      const diagram = page.getByRole('group', { name: copy.projects.entries.cnp.diagram.systemLabel })
      const server = diagram.getByRole('button', { name: copy.projects.entries.cnp.diagram.nodes.server.title, exact: true })
      if (width === 1440) {
        await server.hover()
        await expect(diagram.locator('.architecture-diagram__edge--active')).toHaveCount(4)
      }
      await server.focus()
      await page.keyboard.press('Enter')
      const popup = page.getByRole('dialog', { name: copy.projects.entries.cnp.diagram.nodes.server.title })
      await expect(popup).toBeVisible()
      await expect(popup).toContainText(copy.projects.entries.cnp.diagram.nodes.server.detail)
      await page.keyboard.press('Escape')
      await expect(popup).toBeHidden()
      await expect(server).toBeFocused()
      await server.tap()
      await expect(popup).toBeVisible()
      await popup.getByRole('button', { name: copy.projects.entries.cnp.diagram.close }).click()
      await expect(popup).toBeHidden()
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

      const trigger = page.locator('.project-screenshot__image-trigger').first()
      await trigger.click()
      const gallery = page.getByRole('dialog', { name: copy.case.gallery.title })
      await expect(gallery).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(gallery).toBeHidden()
      expect(errors).toEqual([])
    })
  }
}
