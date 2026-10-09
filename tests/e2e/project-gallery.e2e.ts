import { expect, test } from '@playwright/test'
import { LocaleCode } from '../../app/types/i18n'
import en from '../../i18n/locales/en.json' with { type: 'json' }
import ru from '../../i18n/locales/ru.json' with { type: 'json' }

const translations = { [LocaleCode.Ru]: ru, [LocaleCode.En]: en }

for (const locale of Object.values(LocaleCode)) {
  test(`${locale}: PhotoSwipe opens and closes project screenshots`, async ({ page }) => {
    const copy = translations[locale]
    const home = locale === LocaleCode.Ru ? '/' : '/en/'
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
    await page.addInitScript(() => localStorage.setItem('va-theme-preference', 'light'))
    await page.context().addCookies([{ name: 'i18n_redirected', value: locale, url: 'http://127.0.0.1:3000' }])
    await page.goto(`${home}projects/planes-arch/`)
    await page.waitForFunction(() => {
      const browser = window as Window & { useNuxtApp?: () => { isHydrating: boolean } }
      return browser.useNuxtApp?.().isHydrating === false
    })

    const trigger = page.locator('.project-screenshot__image-trigger').first()
    await trigger.click()
    const gallery = page.getByRole('dialog', { name: copy.case.gallery.title })
    await expect(gallery).toBeVisible()
    await expect(gallery).toBeFocused()
    const image = gallery.locator('.pswp__item[aria-hidden="false"] .pswp__img:not(.pswp__img--placeholder)')
    await expect(image).toHaveAttribute('src', `/projects/planes-arch/planes-arch-landing-${locale}-light.webp`)
    await expect(image).toHaveAttribute('alt', copy.projects.entries.planesArch.media.landing.alt)

    const close = gallery.getByRole('button', { name: copy.case.closeImage, exact: true })
    await expect(close.locator('svg.pswp__icn')).toHaveCount(1)
    await close.click()
    await expect(gallery).toBeHidden()
    await expect(trigger).toBeFocused()
  })
}
