import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { projects } from '../../app/data/projects'
import { LocaleCode } from '../../app/types/i18n'
import en from '../../i18n/locales/en.json' with { type: 'json' }
import ru from '../../i18n/locales/ru.json' with { type: 'json' }

const translations = { [LocaleCode.Ru]: ru, [LocaleCode.En]: en }
const widths = [1440, 1100, 390]

async function expectNoOverflow(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
}

for (const locale of Object.values(LocaleCode)) {
  const copy = translations[locale]
  const home = locale === LocaleCode.Ru ? '/' : '/en/'
  for (const theme of ['system', 'phosphor']) {
    for (const width of widths) {
      test(`${locale} / ${theme} / ${width}: home and all cases`, async ({ page }, testInfo) => {
        test.setTimeout(120000)
        await page.setViewportSize({ width, height: 1000 })
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await page.addInitScript(value => localStorage.setItem('va-theme', value), theme)
        const errors: string[] = []
        page.on('pageerror', error => errors.push(error.message))
        page.on('console', (message) => {
          if (/hydration/i.test(message.text())) errors.push(message.text())
        })
        await page.context().addCookies([{ name: 'i18n_redirected', value: locale, url: 'http://127.0.0.1:3000' }])
        await page.goto(home)
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
        await expect(page.locator('h1')).toHaveText(copy.hero.statement)
        expect(await page.locator('main > section').evaluateAll(nodes => nodes.map(node => node.id)))
          .toEqual(['top', 'services', 'projects', 'process', 'about', 'contacts', 'flight'])
        await expect(page.locator('#services article')).toHaveCount(4)
        for (const item of await page.locator('#services article p').all()) await expect(item).toBeVisible()
        await expect(page.locator('.project-row')).toHaveCount(6)
        for (const preview of await page.locator('.project-row img').all()) {
          await preview.scrollIntoViewIfNeeded()
          await expect(preview).toBeVisible()
          await expect.poll(() => preview.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
        }
        await expectNoOverflow(page)
        await page.locator('h1').scrollIntoViewIfNeeded()
        await page.screenshot({ path: testInfo.outputPath(`home-${locale}-${theme}-${width}.png`) })
        for (const project of projects) {
          await page.goto(`${home}projects/${project.slug}/`)
          await expect(page.locator('h1')).toContainText(project.title.split(' ')[0])
          await expect(page.locator('.project-brief__steps dt')).toHaveText(Object.values(copy.case.brief))
          await expect(page.locator('.project-brief__steps dd')).toHaveCount(3)
          const details = page.locator('.technical-details')
          await expect(details).not.toHaveAttribute('open')
          await details.locator('summary').focus()
          await page.keyboard.press('Enter')
          await expect(details).toHaveAttribute('open', '')
          await expect(details.locator('li').first()).toBeVisible()
          await page.keyboard.press('Enter')
          await expect(details).not.toHaveAttribute('open')
          if (project.slug === 'powersketch') {
            await expect(page.locator('.project-brief__statistics dd')).toHaveText([
              copy.projects.entries.powersketch.metrics.visitorsValue,
              copy.projects.entries.powersketch.metrics.visitsValue,
              copy.projects.entries.powersketch.metrics.viewsValue,
            ])
            await expect(page.locator('.project-brief__statistics > p')).toHaveText(copy.projects.entries.powersketch.metrics.period)
          }
          await expectNoOverflow(page)
          await page.locator('h1').scrollIntoViewIfNeeded()
          await page.screenshot({ path: testInfo.outputPath(`${project.slug}-${locale}-${theme}-${width}.png`) })
        }
        expect(errors).toEqual([])
      })
    }
  }

  test(`${locale}: keyboard, contact, gallery, editor, console and game`, async ({ page }) => {
    test.setTimeout(90000)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.context().addCookies([{ name: 'i18n_redirected', value: locale, url: 'http://127.0.0.1:3000' }])
    await page.goto(home)
    await expect(page.locator('html')).toHaveAttribute('data-theme', /system|phosphor/)
    await expect(page.locator('.terminal-console__trigger')).toBeVisible()
    const contact = page.locator('.hero__action-contact')
    await contact.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('a[href^="mailto:"]').first()).toBeVisible()
    await expect(dialog.locator('a[href^="https://t.me/"]').first()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(contact).toBeFocused()
    const editorToggle = page.locator('.hero__workbench-toggle')
    await expect(editorToggle).toHaveAttribute('aria-expanded', 'false')
    await editorToggle.click()
    await page.getByRole('button', { name: copy.workbench.run }).click()
    await expect(page.getByRole('button', { name: copy.workbench.rerun })).toBeVisible()
    await editorToggle.click()
    await expect(page.locator('#hero-workbench-panel')).toBeHidden()
    await page.locator('.terminal-console__trigger').click()
    await page.locator('.terminal-console__form input').fill(copy.terminal.commands.process.token)
    await page.locator('.terminal-console__form input').press('Enter')
    await expect(page).toHaveURL(/#process$/)
    await page.getByRole('button', { name: copy.nav.open }).click()
    await expect(page.locator('.mobile-nav-list strong')).toHaveText([
      copy.nav.sections.services, copy.nav.sections.projects, copy.nav.sections.process, copy.nav.sections.about,
    ])
    await page.getByRole('button', { name: copy.nav.close, exact: true }).click()
    await page.locator('#flight').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: copy.flight.run, exact: true }).click()
    await expect(page.locator('.flight-stage')).toHaveClass(/is-running/)
    await page.keyboard.press('ArrowLeft')
    await page.goto(`${home}projects/forma/`)
    await expect(page.locator('html')).toHaveAttribute('data-theme', /system|phosphor/)
    await expect(page.locator('.terminal-console__trigger')).toBeVisible()
    const enlarge = page.getByRole('button', { name: copy.case.viewImage, exact: true }).first()
    await enlarge.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('dialog[open]')).toHaveCount(1)
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('dialog[open]')).toHaveCount(1)
    await page.keyboard.press('Escape')
    await expect(page.locator('dialog[open]')).toHaveCount(0)
    await page.getByRole('link', { name: copy.case.back, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`${home}#projects$`))
  })
}
