import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { LocaleCode } from '../../app/types/i18n'
import en from '../../i18n/locales/en.json' with { type: 'json' }
import ru from '../../i18n/locales/ru.json' with { type: 'json' }

const translations = { [LocaleCode.Ru]: ru, [LocaleCode.En]: en }
const scenarios = [
  { width: 1440, theme: 'light', reducedMotion: 'no-preference' },
  { width: 1100, theme: 'dark', reducedMotion: 'reduce' },
  { width: 390, theme: 'auto', reducedMotion: 'reduce' },
] as const

for (const locale of Object.values(LocaleCode)) {
  const copy = translations[locale]
  const home = locale === LocaleCode.Ru ? '/' : '/en/'

  for (const scenario of scenarios) {
    test(`${locale} / ${scenario.width} / ${scenario.theme}: lightGallery retains sources, controls and focus`, async ({ page }, testInfo) => {
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('console', (message) => {
        if (/hydration/i.test(message.text())) errors.push(message.text())
      })
      await page.setViewportSize({ width: scenario.width, height: 900 })
      await page.emulateMedia({ colorScheme: 'dark', reducedMotion: scenario.reducedMotion })
      await page.addInitScript(value => localStorage.setItem('va-theme-preference', value), scenario.theme)
      await page.context().addCookies([{ name: 'i18n_redirected', value: locale, url: 'http://127.0.0.1:3000' }])
      await page.goto(`${home}projects/planes-arch/`)
      await page.waitForFunction(() => {
        const browser = window as Window & { useNuxtApp?: () => { isHydrating: boolean } }
        return browser.useNuxtApp?.().isHydrating === false
      })

      const trigger = page.locator('.project-screenshot__image-trigger').first()
      const screenshots = page.locator('.project-screenshot')
      const count = await screenshots.count()
      const theme = scenario.theme === 'auto' ? 'dark' : scenario.theme
      await trigger.click()
      const gallery = page.getByRole('dialog', { name: copy.case.gallery.title })
      const currentSlide = gallery.locator('.lg-item.lg-current')
      const currentImage = currentSlide.locator('.lg-image')
      const counter = gallery.locator('.lg-counter-current')
      await expect(gallery).toBeVisible()
      await expect(currentSlide).toHaveClass(/lg-complete/)
      await expect(currentImage).toHaveAttribute('src', `/projects/planes-arch/planes-arch-landing-${locale}-${theme}.webp`)
      await expect(currentImage).toHaveAttribute('alt', copy.projects.entries.planesArch.media.landing.alt)
      await expect(gallery.locator('.lg-sub-html')).toHaveText(copy.projects.entries.planesArch.media.landing.caption)
      await expect(gallery.locator('.lg-counter-all')).toHaveText(String(count))
      await expect(page.locator('body')).toHaveClass(/lg-overlay-open/)

      for (const label of [copy.case.closeImage, copy.case.previousImage, copy.case.nextImage, copy.case.gallery.zoomIn, copy.case.gallery.zoomOut]) {
        const button = gallery.getByRole('button', { name: label, exact: true })
        await expect(button).toBeVisible()
        await expect(button.locator('svg.base-icon')).toHaveCount(1)
        expect(await button.evaluate(element => getComputedStyle(element, '::after').content)).toBe('none')
      }

      await expect(currentSlide).toHaveClass(/lg-zoomable/)
      await gallery.getByRole('button', { name: copy.case.gallery.zoomIn, exact: true }).click()
      await expect(gallery.locator('.lg-outer')).toHaveClass(/lg-zoomed/)
      await gallery.getByRole('button', { name: copy.case.gallery.zoomOut, exact: true }).click()
      await expect(gallery.locator('.lg-outer')).not.toHaveClass(/lg-zoomed/)
      await currentImage.evaluate(async image => await Promise.all(image.getAnimations().map(animation => animation.finished)))
      await expect.poll(() => gallery.locator('.lg-sub-html').evaluate(element => getComputedStyle(element).opacity)).toBe('1')

      if (locale === LocaleCode.Ru) {
        await page.screenshot({ path: testInfo.outputPath('gallery.png') })
      }

      const accessibility = await new AxeBuilder({ page }).include('.project-lightgallery').analyze()
      expect(accessibility.violations).toEqual([])

      await gallery.getByRole('button', { name: copy.case.previousImage, exact: true }).click()
      await expect(counter).toHaveText(String(count))
      await expect(currentSlide).toHaveClass(/lg-complete/)
      await page.keyboard.press('Escape')
      await expect(gallery).toBeHidden()
      await expect(trigger).toBeFocused()
      await expect(page.locator('body')).not.toHaveClass(/lg-overlay-open/)

      const captionTrigger = screenshots.nth(2).locator('figcaption button')
      await captionTrigger.click()
      await expect(gallery).toBeVisible()
      await expect(counter).toHaveText('3')
      await gallery.getByRole('button', { name: copy.case.closeImage, exact: true }).click()
      await expect(gallery).toBeHidden()
      await expect(captionTrigger).toBeFocused()

      // A theme-specific example must retain its own source in either site theme.
      await screenshots.nth(3).locator('.project-screenshot__image-trigger').click()
      await expect(gallery).toBeVisible()
      await expect(currentImage).toHaveAttribute('src', `/projects/planes-arch/planes-arch-landing-${locale}-light.webp`)
      await page.keyboard.press('Escape')
      await expect(gallery).toBeHidden()
      await page.locator('.project-case__top a').click()
      await expect(page).toHaveURL(new RegExp(`${home}#projects$`))
      await expect(page.locator('.project-lightgallery')).toHaveCount(0)
      await expect(page.locator('body')).not.toHaveClass(/lg-overlay-open/)
      expect(errors).toEqual([])
    })
  }
}

test.describe('Touch gallery', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } })

  test('a swipe changes the screenshot and the close button restores the page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.context().addCookies([{ name: 'i18n_redirected', value: LocaleCode.Ru, url: 'http://127.0.0.1:3000' }])
    await page.goto('/projects/forma/')
    await expect(page.locator('.project-lightgallery')).toHaveCount(1)
    await page.locator('.project-case').evaluate((element) => {
      element.addEventListener('lgAfterSlide', () => {
        element.setAttribute('data-gallery-settled', 'true')
      }, { once: true })
    })
    const trigger = page.locator('.project-screenshot__image-trigger').first()
    await trigger.tap()
    await expect(page.locator('.project-case')).toHaveAttribute('data-gallery-settled', 'true')
    const gallery = page.getByRole('dialog', { name: ru.case.gallery.title })
    await expect(gallery.locator('.lg-current')).toHaveClass(/lg-complete/)
    const client = await page.context().newCDPSession(page)
    const point = { x: 280, y: 350 }
    await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] })
    for (const x of [240, 190, 140, 90]) {
      await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: point.y }] })
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect(gallery.locator('.lg-counter-current')).toHaveText('2')
    await gallery.getByRole('button', { name: ru.case.closeImage }).tap()
    await expect(gallery).toBeHidden()
    await expect(page.locator('body')).not.toHaveClass(/lg-overlay-open/)
    await client.detach()
  })
})
