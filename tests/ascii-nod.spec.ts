import { describe, expect, it } from 'vitest'
import { getAsciiNodPitch, getAsciiNodRoll } from '../app/utils/asciiNod'
import { asciiMotion } from '../app/utils/asciiPortraitConfig'

describe('ASCII affirmative nod', () => {
  it('makes exactly two downward nods and returns to neutral', () => {
    const samples = Array.from({ length: 1001 }, (_, index) => getAsciiNodPitch(asciiMotion.nodDurationSeconds * index / 1000))
    const troughs = samples.filter((pitch, index) => index > 0 && index < samples.length - 1
      && pitch < 0 && pitch < samples[index - 1]! && pitch < samples[index + 1]!)
    expect(troughs).toHaveLength(2)
    expect(Math.abs(troughs[1]!)).toBeLessThan(Math.abs(troughs[0]!))
    expect(samples[0]).toBe(0)
    expect(samples.at(-1)).toBe(0)
    expect(samples.every(pitch => pitch <= asciiMotion.maxNodPitchRadians * 0.071
      && pitch >= -asciiMotion.maxNodPitchRadians - 1e-12)).toBe(true)
    expect(getAsciiNodPitch(-1)).toBe(0)
    expect(getAsciiNodPitch(asciiMotion.nodDurationSeconds + 1)).toBe(0)
  })

  it('has continuous velocity and acceleration at reversals without a flat pause', () => {
    const delta = 0.00001
    for (const keyframe of asciiMotion.nodKeyframes.slice(1, -1)) {
      const time = keyframe.time * asciiMotion.nodDurationSeconds
      const pitch = getAsciiNodPitch(time)
      const left = getAsciiNodPitch(time - delta)
      const right = getAsciiNodPitch(time + delta)
      expect(Math.abs((right - left) / (2 * delta))).toBeLessThan(0.0001)
      const before = (pitch - 2 * left + getAsciiNodPitch(time - 2 * delta)) / delta ** 2
      const after = (getAsciiNodPitch(time + 2 * delta) - 2 * right + pitch) / delta ** 2
      expect(Math.abs(before - after)).toBeLessThan(0.02)
      expect(Math.abs(before)).toBeGreaterThan(0.1)
    }
    // The rebound connects the nods through neutral at a nonzero speed.
    const crossing = 0.39 * asciiMotion.nodDurationSeconds
    const speed = (getAsciiNodPitch(crossing + delta) - getAsciiNodPitch(crossing - delta)) / (2 * delta)
    expect(speed).toBeGreaterThan(0.1)
  })

  it('overlaps both nods with one small lean that starts and ends at zero', () => {
    expect(getAsciiNodRoll(0)).toBe(0)
    expect(getAsciiNodRoll(asciiMotion.nodDurationSeconds)).toBe(0)
    const samples = Array.from({ length: 101 }, (_, index) => getAsciiNodRoll(asciiMotion.nodDurationSeconds * index / 100))
    expect(samples.every(roll => roll >= 0 && roll <= asciiMotion.maxNodRollRadians)).toBe(true)
    expect(getAsciiNodRoll(asciiMotion.nodDurationSeconds / 2)).toBe(asciiMotion.maxNodRollRadians)
  })
})
