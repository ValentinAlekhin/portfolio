import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { projects } from '../../app/data/projects'
import { LocaleCode } from '../../app/types/i18n'
import en from '../../i18n/locales/en.json' with { type: 'json' }
import ru from '../../i18n/locales/ru.json' with { type: 'json' }

const translations = { [LocaleCode.Ru]: ru, [LocaleCode.En]: en }
const widths = [320, 390, 768, 1100, 1440]

async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const browser = window as Window & { useNuxtApp?: () => { isHydrating: boolean } }
    return browser.useNuxtApp?.().isHydrating === false
  })
}

async function expectNoOverflow(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
}

for (const locale of Object.values(LocaleCode)) {
  const copy = translations[locale]
  const home = locale === LocaleCode.Ru ? '/' : '/en/'

  for (const width of widths) {
    test(`${locale} / ${width}: home is readable and monochrome`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.context().addCookies([{ name: 'i18n_redirected', value: locale, url: 'http://127.0.0.1:3000' }])
      await page.goto(home)
      await expect(page.locator('h1')).toHaveText(copy.hero.statement)
      expect(await page.locator('main > section').evaluateAll(nodes => nodes.map(node => node.id)))
        .toEqual(['top', 'projects', 'services', 'process', 'contacts'])
      await expect(page.locator('.project-row')).toHaveCount(6)
      await expect(page.locator('#services article')).toHaveCount(4)
      if (width >= 1024) await expect(page.locator('.hero__ascii')).toBeVisible()
      else await expect(page.locator('.hero__ascii')).toBeHidden()
      await expectNoOverflow(page)
    })
  }

  for (const theme of ['light', 'dark', 'auto'] as const) {
    test(`${locale} / ${theme}: all cases retain content and media`, async ({ page }) => {
      test.setTimeout(120000)
      await page.setViewportSize({ width: 1100, height: 900 })
      await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })
      await page.addInitScript(value => localStorage.setItem('va-theme-preference', value), theme)
      await page.context().addCookies([{ name: 'i18n_redirected', value: locale, url: 'http://127.0.0.1:3000' }])
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', (message) => {
        if (/hydration/i.test(message.text())) errors.push(message.text())
      })
      for (const project of projects) {
        await page.goto(`${home}projects/${project.slug}/`)
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme === 'auto' ? 'dark' : theme)
        await expect(page.locator('.project-case')).toHaveAttribute('data-project-theme', project.theme)
        await expect(page.locator('h1')).toHaveText(project.title)
        await expect(page.locator('.project-brief__steps dt')).toHaveText(Object.values(copy.case.brief))
        await expect(page.locator('.project-brief__steps dd')).toHaveCount(3)
        await expect(page.locator('.technical-details')).not.toHaveAttribute('open')
        await page.locator('.technical-details summary').focus()
        await page.keyboard.press('Enter')
        await expect(page.locator('.technical-details')).toHaveAttribute('open', '')
        await expectNoOverflow(page)
      }
      expect(errors).toEqual([])
    })
  }

  test(`${locale}: project previews keep selection and mobile disclosures remember manual choice`, async ({ page }) => {
    await page.context().addCookies([{ name: 'i18n_redirected', value: locale, url: 'http://127.0.0.1:3000' }])
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(home)
    await waitForHydration(page)
    const row = page.locator('.project-row').first()
    await row.locator('.project-row__head').scrollIntoViewIfNeeded()
    await expect(row.locator('.project-row__toggle')).toHaveAttribute('aria-expanded', 'true')
    await row.locator('.project-row__toggle').click()
    await expect(row.locator('.project-row__toggle')).toHaveAttribute('aria-expanded', 'false')
    await page.locator('#contacts').scrollIntoViewIfNeeded()
    await row.locator('.project-row__head').scrollIntoViewIfNeeded()
    await expect(row.locator('.project-row__toggle')).toHaveAttribute('aria-expanded', 'false')
    await row.locator('h3 a').click()
    await expect(page).toHaveURL(new RegExp(`${home}projects/${projects[0]?.slug}/$`))
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(home)
    await waitForHydration(page)
    const selectors = page.locator('.project-selector')
    const panels = page.locator('.project-showcase__panels .project-preview')
    await expect(selectors.first()).toHaveClass(/project-selector--active/)
    await expect(panels.first()).toBeVisible()
    await selectors.nth(1).hover()
    await expect(selectors.nth(1)).toHaveClass(/project-selector--active/)
    await expect(panels.nth(1)).toBeVisible()
    await panels.nth(1).hover()
    await expect(selectors.nth(1)).toHaveClass(/project-selector--active/)
    await selectors.nth(2).focus()
    await expect(selectors.nth(2)).toHaveClass(/project-selector--active/)
    await page.keyboard.press('ArrowDown')
    await expect(selectors.nth(3)).toHaveClass(/project-selector--active/)
    await page.locator('h1').focus()
    await expect(selectors.nth(3)).toHaveClass(/project-selector--active/)
    await selectors.first().click()
    await expect(page).toHaveURL(new RegExp(`${home}projects/${projects[0]?.slug}/$`))
  })

  test(`${locale}: contact dialog and screenshot gallery remain keyboard accessible`, async ({ page }) => {
    await page.context().addCookies([{ name: 'i18n_redirected', value: locale, url: 'http://127.0.0.1:3000' }])
    await page.goto(home)
    await waitForHydration(page)
    const contact = page.locator('.hero__primary')
    await contact.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('a[href^="mailto:"]')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await page.goto(`${home}projects/forma/`)
    await waitForHydration(page)
    const enlarge = page.getByRole('button', { name: copy.case.viewImage, exact: true }).first()
    await enlarge.focus()
    await page.keyboard.press('Enter')
    const gallery = page.getByRole('dialog', { name: copy.case.gallery.title })
    await expect(gallery).toBeVisible()
    await expect(gallery.locator('.lg-item.lg-current.lg-complete')).toBeVisible()
    await expect(gallery.locator('.lg-current')).toHaveClass(/lg-zoomable/)
    await expect(gallery.locator('.lg-counter-current')).toHaveText('1')
    await expect.poll(async () => {
      await page.keyboard.press('ArrowRight')
      return gallery.locator('.lg-counter-current').textContent()
    }).toBe('2')
    await page.keyboard.press('Escape')
    await expect(gallery).toBeHidden()
    await expect(enlarge).toBeFocused()
  })
}
