import { Buffer } from 'node:buffer'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Download, Page } from '@playwright/test'
import JSZip from 'jszip'

async function readDownload(download: Download): Promise<Buffer> {
  const stream = await download.createReadStream()
  if (!stream) throw new Error('Download stream is unavailable')

  const chunks: Buffer[] = []
  for await (const chunk of stream) chunks.push(Buffer.from(chunk))
  return Buffer.concat(chunks)
}

async function downloadFrom(
  page: Page,
  buttonName: string,
) {
  const pendingDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: buttonName }).click()
  return pendingDownload
}

function readPngDimensions(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return {
    height: view.getUint32(20),
    width: view.getUint32(16),
  }
}

function readPngDensity(bytes: Uint8Array): number | undefined {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let offset = 8

  while (offset + 12 <= bytes.length) {
    const length = view.getUint32(offset)
    const type = String.fromCharCode(...bytes.slice(offset + 4, offset + 8))
    if (type === 'pHYs') return view.getUint32(offset + 8)
    offset += length + 12
  }

  return undefined
}

test('renders both localized card sides accessibly', async ({ page }) => {
  await page.goto('/card/')

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Визитка без лишних слов')
  await expect(page.locator('.business-card-page__preview article')).toHaveCount(2)
  await expect(page.locator('.business-card-page__preview img')).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow')
  await expect(
    page.getByRole('banner').getByRole('link', { name: /Switch language|Переключить язык/ }),
  ).toHaveAttribute('href', '/en/card/')

  const accessibility = await new AxeBuilder({ page })
    .include('#main-content')
    .analyze()
  expect(accessibility.violations).toEqual([])

  await page.goto('/en/card/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A business card without the jargon')
  await expect(page.locator('.business-card-page__preview img'))
    .toHaveAttribute('alt', 'QR code linking to the alekhin.dev website')
})

test('downloads the combined share image at the documented size', async ({ page }) => {
  await page.goto('/card/')
  await expect(page.locator('.business-card-page__preview img')).toBeVisible()

  const download = await downloadFrom(page, 'Скачать изображение')
  expect(download.suggestedFilename()).toBe('valentin-alekhin-business-card-ru.png')

  const bytes = await readDownload(download)
  expect(Array.from(bytes.subarray(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10])
  expect(readPngDimensions(bytes)).toEqual({ width: 1440, height: 1680 })
})

test('downloads two 300 DPI print sides in a ZIP archive', async ({ page }) => {
  await page.goto('/en/card/')
  await expect(page.locator('.business-card-page__preview img')).toBeVisible()

  const download = await downloadFrom(page, 'Print-ready pack')
  expect(download.suggestedFilename()).toBe('valentin-alekhin-business-card-print-en.zip')

  const archive = await JSZip.loadAsync(await readDownload(download))
  const frontName = 'valentin-alekhin-business-card-front-en-90x50-300dpi.png'
  const backName = 'valentin-alekhin-business-card-back-en-90x50-300dpi.png'

  expect(Object.keys(archive.files).sort()).toEqual([
    'README.txt',
    backName,
    frontName,
  ])

  for (const filename of [frontName, backName]) {
    const bytes = await archive.file(filename)!.async('uint8array')
    expect(readPngDimensions(bytes)).toEqual({ width: 1134, height: 661 })
    expect(readPngDensity(bytes)).toBe(11811)
  }
})

test('keeps the preview within a small mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/card/')
  await expect(page.locator('.business-card-page__preview img')).toBeVisible()

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }))
  expect(dimensions.documentWidth).toBe(dimensions.viewportWidth)
})
