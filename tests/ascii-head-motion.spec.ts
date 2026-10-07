import { describe, expect, it } from 'vitest'
import { createAsciiHeadMotion } from '../app/utils/asciiHeadMotion'
import { asciiMotion } from '../app/utils/asciiPortraitConfig'

describe('ASCII head tracking', () => {
  it('accelerates from rest, stays within the turn limits and settles exactly', () => {
    const motion = createAsciiHeadMotion()
    const elapsed = 1 / 30
    motion.update(asciiMotion.maxPitchRadians, asciiMotion.maxYawRadians, elapsed)
    const firstStep = motion.yaw
    motion.update(asciiMotion.maxPitchRadians, asciiMotion.maxYawRadians, elapsed)
    expect(motion.yaw - firstStep).toBeGreaterThan(firstStep)
    let moving = true
    for (let frame = 0; frame < 90; frame++) {
      moving = motion.update(asciiMotion.maxPitchRadians, asciiMotion.maxYawRadians, elapsed)
      expect(motion.pitch).toBeLessThanOrEqual(asciiMotion.maxPitchRadians)
      expect(motion.yaw).toBeLessThanOrEqual(asciiMotion.maxYawRadians)
      expect(Math.abs(motion.roll)).toBeLessThanOrEqual(asciiMotion.maxRollRadians)
    }
    expect(moving).toBe(false)
    expect(motion.pitch).toBe(asciiMotion.maxPitchRadians)
    expect(motion.yaw).toBe(asciiMotion.maxYawRadians)
    expect(motion.roll).toBe(-asciiMotion.maxRollRadians)
    motion.reset()
    expect([motion.pitch, motion.yaw, motion.roll]).toEqual([0, 0, 0])
    expect(motion.update(0, 0, elapsed)).toBe(false)
  })

  it('keeps momentum when the cursor reverses instead of abruptly reversing the head', () => {
    const motion = createAsciiHeadMotion()
    motion.update(0, asciiMotion.maxYawRadians, 0.06)
    const before = motion.yaw
    motion.update(0, -asciiMotion.maxYawRadians, 0.001)
    expect(motion.yaw).toBeGreaterThan(before)
    motion.update(0, -asciiMotion.maxYawRadians, 0.1)
    expect(motion.yaw).toBeLessThan(before)
  })

  it('follows the same main rotation at 30 and 60 frames per second', () => {
    const atThirty = createAsciiHeadMotion()
    const atSixty = createAsciiHeadMotion()
    for (let frame = 0; frame < 9; frame++) atThirty.update(0.05, 0.15, 1 / 30)
    for (let frame = 0; frame < 18; frame++) atSixty.update(0.05, 0.15, 1 / 60)
    expect(atThirty.pitch).toBeCloseTo(atSixty.pitch, 12)
    expect(atThirty.yaw).toBeCloseTo(atSixty.yaw, 12)
  })
})
