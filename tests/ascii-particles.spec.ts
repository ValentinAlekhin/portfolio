import { describe, expect, it } from 'vitest'
import { createAsciiParticleLayout } from '../app/utils/asciiParticles'

function seededRandom() {
  let seed = 42
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
}

describe('ASCII particle assembly', () => {
  it('starts particles outside the silhouette, close to their destination', () => {
    const columns = 24
    const rows = 32
    const mask = new Uint8Array(columns * rows)
    for (let y = 8; y < 24; y++) {
      for (let x = 6; x < 18; x++) mask[y * columns + x] = 1
    }
    const { origins } = createAsciiParticleLayout(mask, columns, rows, 384, 512, seededRandom())
    for (let index = 0; index < mask.length; index++) {
      if (!mask[index]) continue
      const originX = Math.floor(origins[index * 2]! * columns)
      const originY = Math.floor(origins[index * 2 + 1]! * rows)
      expect(mask[originY * columns + originX]).toBe(0)
      const distance = Math.hypot(
        origins[index * 2]! * 384 - (index % columns + 0.5) * 16,
        origins[index * 2 + 1]! * 512 - (Math.floor(index / columns) + 0.5) * 16,
      )
      expect(distance).toBeLessThanOrEqual(180.001)
    }
  })

  it('mixes approach directions even for adjacent particles beside the same edge', () => {
    const columns = 128
    const rows = 102
    const mask = new Uint8Array(columns * rows)
    for (let y = 15; y < 87; y++) {
      for (let x = 28; x < 100; x++) mask[y * columns + x] = 1
    }
    const { origins } = createAsciiParticleLayout(mask, columns, rows, 384, 512, seededRandom())
    let fromLeft = 0
    let fromRight = 0
    let diagonal = 0
    const bands = new Set<number>()
    for (let y = 44; y < 58; y++) {
      for (let x = 56; x < 72; x++) {
        const index = y * columns + x
        const dx = origins[index * 2]! * 384 - (x + 0.5) * 3
        const dy = origins[index * 2 + 1]! * 512 - (y + 0.5) * 512 / rows
        if (dx < 0) fromLeft++
        else fromRight++
        if (Math.abs(dy) > 24) diagonal++
        bands.add(Math.floor(origins[index * 2 + 1]! * 512 / 20))
      }
    }
    expect(fromLeft).toBeGreaterThan(50)
    expect(fromRight).toBeGreaterThan(50)
    expect(diagonal).toBeGreaterThan(100)
    expect(bands.size).toBeGreaterThan(8)
  })

  it('keeps curved trajectories local and varies their deceleration', () => {
    const mask = new Uint8Array(100)
    mask.fill(1, 30, 70)
    const { origins, curves } = createAsciiParticleLayout(mask, 10, 10, 100, 100, seededRandom())
    const easing = new Set<number>()
    for (let index = 30; index < 70; index++) {
      const distance = Math.hypot(
        origins[index * 2]! * 100 - (index % 10 + 0.5) * 10,
        origins[index * 2 + 1]! * 100 - (Math.floor(index / 10) + 0.5) * 10,
      )
      const bend = Math.hypot(curves[index * 3]! * 100, curves[index * 3 + 1]! * 100)
      expect(bend).toBeGreaterThan(0)
      expect(bend).toBeLessThanOrEqual(Math.min(48, distance * 0.24) + 0.001)
      expect(curves[index * 3 + 2]).toBeGreaterThanOrEqual(2.2)
      expect(curves[index * 3 + 2]).toBeLessThanOrEqual(4.2)
      easing.add(curves[index * 3 + 2]!)
    }
    expect(easing.size).toBeGreaterThan(30)
  })

  it('varies both start and finish times within the animation bounds', () => {
    const { timing } = createAsciiParticleLayout(new Uint8Array(100), 10, 10, 100, 100, seededRandom())
    const starts = new Set<number>()
    const finishes = new Set<number>()
    for (let index = 0; index < 100; index++) {
      const start = timing[index * 2]!
      const finish = timing[index * 2 + 1]!
      expect(start).toBeGreaterThanOrEqual(0)
      expect(start).toBeLessThanOrEqual(0.25)
      expect(finish).toBeGreaterThanOrEqual(0.6499)
      expect(finish).toBeLessThanOrEqual(1)
      expect(finish - start).toBeGreaterThanOrEqual(0.4)
      starts.add(start)
      finishes.add(finish)
    }
    expect(starts.size).toBeGreaterThan(1)
    expect(finishes.size).toBeGreaterThan(1)
  })

  it('uses the closest frame edge when the model fills the entire frame', () => {
    const { origins } = createAsciiParticleLayout(new Uint8Array(16).fill(1), 4, 4, 40, 40, seededRandom())
    for (let index = 0; index < 16; index++) {
      const x = origins[index * 2]!
      const y = origins[index * 2 + 1]!
      expect(x < 0 || x > 1 || y < 0 || y > 1).toBe(true)
    }
    expect(origins[0]).toBeLessThan(0)
    expect(origins[15 * 2]).toBeGreaterThan(1)
  })
})
