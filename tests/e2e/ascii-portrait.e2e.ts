import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import sharp from 'sharp'
import { LocaleCode } from '../../app/types/i18n'
import en from '../../i18n/locales/en.json' with { type: 'json' }
import ru from '../../i18n/locales/ru.json' with { type: 'json' }

test.setTimeout(60000)

async function prepare(page: Page, locale = LocaleCode.Ru, width = 1440) {
  await page.setViewportSize({ width, height: 1000 })
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
  await page.context().addCookies([{ name: 'i18n_redirected', value: locale, url: 'http://127.0.0.1:3000' }])
}

async function expectRendered(portrait: Locator, background: number) {
  await expect(portrait).toHaveAttribute('data-state', 'ready')
  await expect(portrait.locator('pre')).toBeHidden()
  // Check the actual GPU output, including transparency and monochrome ink.
  await expect.poll(async () => {
    const { data, info } = await sharp(await portrait.screenshot()).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    let foreground = 0
    let colored = 0
    for (let index = 0; index < data.length; index += info.channels) {
      const red = data[index]!
      const green = data[index + 1]!
      const blue = data[index + 2]!
      if (Math.abs(red - background) > 30) foreground++
      if (Math.max(red, green, blue) - Math.min(red, green, blue) > 1) colored++
    }
    const transparentCorner = Math.abs(data[0]! - background) <= 1
    return foreground > 1000 && colored === 0 && transparentCorner
  }).toBe(true)
}

async function watchDraws(page: Page) {
  await page.locator('.ascii-portrait canvas').evaluate((canvas) => {
    const context = (canvas as HTMLCanvasElement).getContext('webgl2')
    if (!context) throw new Error('Portrait has no WebGL context')
    const drawElements = context.drawElements.bind(context)
    canvas.setAttribute('data-draws', '0')
    context.drawElements = (mode, count, type, offset) => {
      canvas.setAttribute('data-draws', String(Number(canvas.getAttribute('data-draws')) + 1))
      drawElements(mode, count, type, offset)
    }
  })
  return () => page.locator('.ascii-portrait canvas').getAttribute('data-draws').then(Number)
}

async function expectIdle(page: Page, draws: () => Promise<number>) {
  await expect.poll(async () => {
    const before = await draws()
    await page.waitForTimeout(150)
    return (await draws()) - before
  }).toBe(0)
}

async function imageContrast(buffer: Buffer) {
  const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  let contrast = 0
  for (let index = 0; index < data.length; index += info.channels) contrast += 255 - data[index]!
  return contrast
}

async function lowerBodyPixels(buffer: Buffer) {
  const { width, height } = await sharp(buffer).metadata()
  if (!width || !height) throw new Error('Portrait image has no dimensions')
  // The lower third stays well below the deforming upper neck.
  const top = Math.floor(height * 2 / 3)
  return sharp(buffer).extract({ left: 0, top, width, height: height - top }).raw().toBuffer()
}

async function imageDifference(first: Buffer, second: Buffer) {
  const a = await sharp(first).removeAlpha().raw().toBuffer()
  const b = await sharp(second).removeAlpha().raw().toBuffer()
  let difference = 0
  for (let index = 0; index < a.length; index++) difference += Math.abs(a[index]! - b[index]!)
  return difference
}

for (const locale of Object.values(LocaleCode)) {
  test(`${locale}: ASCII portrait follows light, dark and automatic themes without reloading the model`, async ({ page }) => {
    await prepare(page, locale)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', (message) => {
      if (/hydration|shader error/i.test(message.text())) errors.push(message.text())
    })
    let modelRequests = 0
    page.on('request', (request) => {
      if (request.url().endsWith('/models/portrait-ascii.glb')) modelRequests++
    })
    const copy = locale === LocaleCode.Ru ? ru : en
    await page.goto(locale === LocaleCode.Ru ? '/' : '/en/')
    const portrait = page.locator('.ascii-portrait')
    await expectRendered(portrait, 255)
    await expect(portrait).toHaveAttribute('aria-hidden', 'true')
    expect(await portrait.boundingBox()).toMatchObject({ width: 384, height: 512 })

    await page.getByRole('button', { name: `${copy.nav.theme}: ${copy.theme.auto}`, exact: true }).focus()
    await page.keyboard.press('ArrowRight')
    await page.getByRole('button', { name: copy.theme.dark, exact: true }).click()
    await expectRendered(portrait, 17)

    await page.getByRole('button', { name: `${copy.nav.theme}: ${copy.theme.dark}`, exact: true }).focus()
    await page.keyboard.press('ArrowRight')
    await page.getByRole('button', { name: copy.theme.auto, exact: true }).click()
    await expectRendered(portrait, 255)
    await page.emulateMedia({ colorScheme: 'dark' })
    await expectRendered(portrait, 17)
    expect(modelRequests).toBe(1)
    expect(errors).toEqual([])
  })
}

test('ASCII portrait loads only on desktop and resizes across its breakpoint', async ({ page }) => {
  await prepare(page, LocaleCode.Ru, 390)
  const modelRequests: string[] = []
  const graphicsRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().endsWith('/models/portrait-ascii.glb')) modelRequests.push(request.url())
    if (/\/utils\/asciiPortrait|\/deps\/three/.test(request.url())) graphicsRequests.push(request.url())
  })
  await page.goto('/')
  await expect(page.locator('.ascii-portrait')).toBeHidden()
  await page.waitForTimeout(250)
  expect(modelRequests).toHaveLength(0)
  expect(graphicsRequests).toHaveLength(0)
  await page.setViewportSize({ width: 1100, height: 1000 })
  await expectRendered(page.locator('.ascii-portrait'), 255)
  expect(modelRequests).toHaveLength(1)
  await page.setViewportSize({ width: 1023, height: 1000 })
  await expect(page.locator('.ascii-portrait')).toHaveAttribute('data-state', 'loading')
  await expect(page.locator('.ascii-portrait')).toBeHidden()
  await page.setViewportSize({ width: 1024, height: 1000 })
  await expectRendered(page.locator('.ascii-portrait'), 255)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('ASCII portrait follows the mouse across the page, stops at rest and respects reduced motion', async ({ page }) => {
  await prepare(page)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const portrait = page.locator('.ascii-portrait')
  await expectRendered(portrait, 255)
  const draws = await watchDraws(page)
  await expectIdle(page, draws)
  const initial = await portrait.screenshot()
  await page.mouse.move(180, 150)
  await expect.poll(draws).toBeGreaterThan(0)
  await expectIdle(page, draws)
  const turned = await portrait.screenshot()
  expect(turned.equals(initial)).toBe(false)
  expect((await lowerBodyPixels(turned)).equals(await lowerBodyPixels(initial))).toBe(true)
  const hero = await page.locator('.hero').boundingBox()
  if (!hero) throw new Error('Hero has no dimensions')
  expect(hero.y + hero.height).toBeLessThan(970)
  const previousDraws = await draws()
  await page.mouse.move(1380, 970)
  await expect.poll(draws).toBeGreaterThan(previousDraws)
  await expectIdle(page, draws)
  const opposite = await portrait.screenshot()
  expect(opposite.equals(turned)).toBe(false)
  expect((await lowerBodyPixels(opposite)).equals(await lowerBodyPixels(initial))).toBe(true)
  await page.locator('html').dispatchEvent('pointerleave', { pointerType: 'mouse' })
  await expectIdle(page, draws)
  expect((await portrait.screenshot()).equals(initial)).toBe(true)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expectIdle(page, draws)
  const still = await portrait.screenshot()
  await page.mouse.move(1250, 600)
  await expectIdle(page, draws)
  expect((await portrait.screenshot()).equals(still)).toBe(true)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(portrait).toHaveAttribute('data-state', 'ready')
  await expectIdle(page, draws)
  await page.locator('#contacts').scrollIntoViewIfNeeded()
  await expectIdle(page, draws)
  const offscreenDraws = await draws()
  await page.mouse.move(80, 850)
  await page.waitForTimeout(200)
  expect(await draws()).toBe(offscreenDraws)
  await page.locator('#top').scrollIntoViewIfNeeded()
  await expectRendered(portrait, 255)
  await expect.poll(draws).toBeGreaterThan(offscreenDraws)
})

test('the discuss button triggers two head nods, keeps the body still and respects reduced motion', async ({ page }) => {
  await prepare(page)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const portrait = page.locator('.ascii-portrait')
  await expectRendered(portrait, 255)
  const button = page.locator('.hero__primary')
  const bounds = await button.boundingBox()
  const clip = await portrait.boundingBox()
  if (!bounds || !clip) throw new Error('Hero elements have no dimensions')
  await page.clock.install()
  await page.clock.pauseAt(new Date(Date.now() + 200))
  // Settle cursor tracking at the button before starting the gesture itself.
  await button.dispatchEvent('pointermove', {
    pointerType: 'mouse', clientX: bounds.x + bounds.width / 2, clientY: bounds.y + bounds.height / 2,
  })
  await page.clock.runFor(1250)
  const neutral = await page.screenshot({ clip })
  const draws = await watchDraws(page)
  await button.dispatchEvent('pointerenter', { pointerType: 'mouse' })
  await page.clock.runFor(17)
  await page.clock.runFor(275)
  const first = await page.screenshot({ clip })
  await page.clock.runFor(220)
  const between = await page.screenshot({ clip })
  await page.clock.runFor(220)
  const second = await page.screenshot({ clip })
  await page.clock.runFor(500)
  const complete = await page.screenshot({ clip })
  const betweenDifference = await imageDifference(neutral, between)
  expect(await imageDifference(neutral, first)).toBeGreaterThan(betweenDifference * 3 + 100)
  expect(await imageDifference(neutral, second)).toBeGreaterThan(betweenDifference * 3 + 100)
  expect((await lowerBodyPixels(first)).equals(await lowerBodyPixels(neutral))).toBe(true)
  expect(complete.equals(neutral)).toBe(true)
  const completedDraws = await draws()
  await page.clock.runFor(500)
  expect(await draws()).toBe(completedDraws)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  // Media-query changes arrive outside the virtual animation clock.
  await expect.poll(async () => {
    await page.clock.runFor(50)
    return draws()
  }).toBeGreaterThan(completedDraws)
  const still = await page.screenshot({ clip })
  const stillDraws = await draws()
  await button.dispatchEvent('pointerenter', { pointerType: 'mouse' })
  await page.clock.runFor(1500)
  expect((await page.screenshot({ clip })).equals(still)).toBe(true)
  expect(await draws()).toBe(stillDraws)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect.poll(async () => {
    await page.clock.runFor(50)
    return draws()
  }).toBeGreaterThan(stillDraws)
  await page.keyboard.press('Tab')
  await button.focus()
  await page.clock.runFor(300)
  expect((await page.screenshot({ clip })).equals(still)).toBe(false)
})

test('ASCII characters assemble and fade in without showing the text art while loading', async ({ page }, testInfo) => {
  await prepare(page)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  let releaseModel: (() => void) | undefined
  let requested = false
  const modelGate = new Promise<void>((resolve) => {
    releaseModel = resolve
  })
  await page.route('**/models/portrait-ascii.glb', async (route) => {
    requested = true
    await modelGate
    await route.continue()
  })
  try {
    await page.goto('/')
    const portrait = page.locator('.ascii-portrait')
    await expect.poll(() => requested).toBe(true)
    await expect(portrait).toHaveAttribute('data-state', 'loading')
    await expect(portrait.locator('pre')).toBeHidden()
    await expect(portrait.locator('canvas')).toBeHidden()
    await page.clock.install()
    await page.clock.pauseAt(new Date(Date.now() + 200))
    releaseModel?.()
    await expect.poll(() => portrait.locator('canvas').evaluate(canvas => (canvas as HTMLCanvasElement).width)).toBe(384)
    await page.clock.runFor(17)
    await expect(portrait).toHaveAttribute('data-state', 'assembling')
    await expect(portrait.locator('pre')).toBeHidden()
    const clip = await portrait.boundingBox()
    if (!clip) throw new Error('Portrait has no dimensions')
    const start = await page.screenshot({ clip })
    expect(await imageContrast(start)).toBe(0)
    await page.clock.runFor(750)
    const middle = await page.screenshot({ clip })
    await page.clock.runFor(1000)
    await expectRendered(portrait, 255)
    const complete = await portrait.screenshot()
    expect(await imageContrast(start)).toBeLessThan(await imageContrast(complete))
    expect(start.equals(complete)).toBe(false)
    expect(await imageContrast(middle)).toBeGreaterThan(0)
    expect(await imageContrast(middle)).toBeLessThan(await imageContrast(complete))
    await testInfo.attach('transparent-start', { body: start, contentType: 'image/png' })
    await testInfo.attach('assembling', { body: middle, contentType: 'image/png' })
    await testInfo.attach('complete', { body: complete, contentType: 'image/png' })
  }
  finally {
    releaseModel?.()
  }
})

test('ASCII portrait keeps the text fallback when model loading fails', async ({ page }) => {
  await prepare(page)
  let requested = false
  await page.route('**/models/portrait-ascii.glb', (route) => {
    requested = true
    return route.abort()
  })
  await page.goto('/')
  await expect.poll(() => requested).toBe(true)
  await expect(page.locator('.ascii-portrait')).toHaveAttribute('data-state', 'fallback')
  await expect(page.locator('.ascii-portrait pre')).toBeVisible()
  await expect(page.locator('.ascii-portrait canvas')).toBeHidden()
})

test('ASCII portrait keeps the text fallback without WebGL', async ({ page }) => {
  await prepare(page)
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value(this: HTMLCanvasElement, type: string, ...args: unknown[]) {
        if (type === 'webgl2') {
          document.documentElement.setAttribute('data-webgl-attempted', 'true')
          return null
        }
        return Reflect.apply(getContext, this, [type, ...args])
      },
    })
  })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-webgl-attempted', 'true')
  await expect(page.locator('.ascii-portrait pre')).toBeVisible()
  await expect.poll(() => page.locator('.ascii-portrait').getAttribute('data-state')).toBe('fallback')
  await expect(page.locator('.ascii-portrait canvas')).toBeHidden()
})
