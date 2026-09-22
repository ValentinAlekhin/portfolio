import { Buffer } from 'node:buffer'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Download, Locator } from '@playwright/test'
import { LocaleCode } from '../../app/types/i18n'
import en from '../../i18n/locales/en.json' with { type: 'json' }
import ru from '../../i18n/locales/ru.json' with { type: 'json' }

const translations = { [LocaleCode.Ru]: ru, [LocaleCode.En]: en }

async function readDownload(download: Download) {
  const stream = await download.createReadStream()
  if (!stream) throw new Error('Download stream is unavailable')
  const chunks: Buffer[] = []
  for await (const chunk of stream) chunks.push(Buffer.from(chunk))
  return Buffer.concat(chunks)
}

async function expectArtworkWithinFrame(artwork: Locator, story: boolean) {
  const overflow = await artwork.evaluate((node, isStory) => {
    const frame = node.getBoundingClientRect()
    const scale = frame.width / 1080
    const top = frame.top + (isStory ? 180 * scale : 0)
    const bottom = frame.bottom - (isStory ? 240 * scale : 0)
    return Array.from(node.querySelectorAll('h2, h3, p, strong, img')).flatMap((element) => {
      const rect = element.getBoundingClientRect()
      return rect.left < frame.left - 1 || rect.right > frame.right + 1
        || rect.top < top - 1 || rect.bottom > bottom + 1
        || element.scrollWidth > element.clientWidth + 1
        ? [element.textContent || element.tagName]
        : []
    })
  }, story)
  expect(overflow).toEqual([])
}

for (const locale of Object.values(LocaleCode)) {
  const copy = translations[locale].presentation
  const route = locale === LocaleCode.Ru ? '/presentation/' : '/en/presentation/'

  test(`${locale}: accessible settings and all PNG formats and palettes`, async ({ page }) => {
    test.setTimeout(90000)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', (message) => {
      if (/hydration/i.test(message.text())) errors.push(message.text())
    })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(copy.title)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
    const preview = page.locator('.presentation-page__preview .presentation-artwork')
    const exported = page.locator('.presentation-page__export .presentation-artwork')
    await expect(preview.locator('img')).toBeVisible()
    await expect(page.locator('input[value="story"]')).toBeChecked()
    await expect(page.locator('input[value="dark"]')).toBeChecked()
    expect((await new AxeBuilder({ page }).include('#main-content').analyze()).violations).toEqual([])

    for (const format of ['story', 'square']) {
      await page.getByRole('radio', { name: new RegExp(copy.formats[format as keyof typeof copy.formats]) }).check()
      await expect(preview).toHaveClass(new RegExp(`presentation-artwork--${format}`))
      for (const palette of ['dark', 'light']) {
        await page.getByRole('radio', { name: copy.palettes[palette as keyof typeof copy.palettes], exact: true }).check()
        await expectArtworkWithinFrame(preview, format === 'story')
        await expectArtworkWithinFrame(exported, format === 'story')
        const pending = page.waitForEvent('download')
        await page.getByRole('button', { name: copy.download.button }).click()
        const download = await pending
        expect(download.suggestedFilename()).toBe(`valentin-alekhin-presentation-${locale}-${format}-${palette}.png`)
        const bytes = await readDownload(download)
        expect(Array.from(bytes.subarray(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10])
        expect(bytes.readUInt32BE(16)).toBe(1080)
        expect(bytes.readUInt32BE(20)).toBe(format === 'story' ? 1920 : 1080)
        await download.saveAs(`/private/tmp/presentation-${locale}-${format}-${palette}.png`)
        await expect(page.locator('.presentation-page__status')).toHaveText(copy.download.success)
      }
    }

    for (const theme of ['system', 'phosphor']) {
      await page.evaluate(value => document.documentElement.dataset.theme = value, theme)
      for (const width of [1440, 1100, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 })
        for (const format of ['story', 'square']) {
          await page.locator(`input[value="${format}"]`).check()
          await expect(preview).toHaveClass(new RegExp(`presentation-artwork--${format}`))
          await expectArtworkWithinFrame(preview, format === 'story')
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
        }
      }
    }

    await page.locator('input[value="story"]').focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('input[value="square"]')).toBeChecked()
    await page.locator('input[value="dark"]').focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('input[value="light"]')).toBeChecked()
    // Export on a touch-sized viewport retains the full-size composition.
    await page.locator('input[value="story"]').check()
    const mobileDownload = page.waitForEvent('download')
    await page.getByRole('button', { name: copy.download.button }).click()
    const mobileBytes = await readDownload(await mobileDownload)
    expect(mobileBytes.readUInt32BE(16)).toBe(1080)
    expect(mobileBytes.readUInt32BE(20)).toBe(1920)
    expect(errors).toEqual([])
  })
}

test('image decoding failure can be retried without reloading', async ({ page }) => {
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode
    let failed = false
    HTMLImageElement.prototype.decode = function () {
      if (!failed && this.src.startsWith('data:image/png')) {
        failed = true
        return Promise.reject(new Error('Simulated image decoding failure'))
      }
      return decode.call(this)
    }
  })
  await page.goto('/presentation/')
  await page.getByRole('button', { name: ru.presentation.download.button }).click()
  await expect(page.locator('.presentation-page__status')).toHaveText(ru.presentation.download.error)
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: ru.presentation.download.retry }).click()
  expect((await pending).suggestedFilename()).toBe('valentin-alekhin-presentation-ru-story-dark.png')
  await expect(page.locator('.presentation-page__status')).toHaveText(ru.presentation.download.success)
})

test('changing locale cancels an in-flight export', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    const decode = HTMLImageElement.prototype.decode
    HTMLImageElement.prototype.decode = async function () {
      await new Promise(resolve => setTimeout(resolve, 1200))
      return decode.call(this)
    }
  })
  const downloads: string[] = []
  page.on('download', download => downloads.push(download.suggestedFilename()))
  await page.goto('/presentation/')
  await page.getByRole('button', { name: ru.presentation.download.button }).click()
  await expect(page.locator('input[value="square"]')).toBeDisabled()
  await expect(page.locator('.presentation-page__status')).toHaveText(ru.presentation.download.rendering)
  await page.locator('.site-header a[href="/en/presentation/"]').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(en.presentation.title)
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: en.presentation.download.button }).click()
  expect((await pending).suggestedFilename()).toBe('valentin-alekhin-presentation-en-story-dark.png')
  expect(downloads).toEqual(['valentin-alekhin-presentation-en-story-dark.png'])
})
