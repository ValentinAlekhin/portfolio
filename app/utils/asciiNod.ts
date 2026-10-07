import { asciiMotion } from './asciiPortraitConfig'

const keyframes = asciiMotion.nodKeyframes.map((keyframe, index, frames) => {
  const previous = frames[index - 1]
  const next = frames[index + 1]
  if (!previous || !next) return { ...keyframe, curvature: 0 }
  // Share acceleration at each reversal instead of flattening both strokes there.
  // Six is the endpoint curvature of a cubic Hermite stroke with zero end speeds;
  // the smaller adjacent limit keeps the quintic curve within the authored poses.
  const curvature = Math.sign(next.pitch - keyframe.pitch) * Math.min(
    6 * Math.abs(keyframe.pitch - previous.pitch) / (keyframe.time - previous.time) ** 2,
    6 * Math.abs(next.pitch - keyframe.pitch) / (next.time - keyframe.time) ** 2,
  )
  return { ...keyframe, curvature }
})

export function getAsciiNodPitch(elapsedSeconds: number) {
  if (elapsedSeconds <= 0 || elapsedSeconds >= asciiMotion.nodDurationSeconds) return 0
  const progress = elapsedSeconds / asciiMotion.nodDurationSeconds
  for (let index = 1; index < keyframes.length; index++) {
    const from = keyframes[index - 1]!
    const to = keyframes[index]!
    if (progress > to.time) continue
    const span = to.time - from.time
    const phase = (progress - from.time) / span
    const difference = to.pitch - from.pitch
    const fromAcceleration = from.curvature * span ** 2
    const toAcceleration = to.curvature * span ** 2
    // Quintic Hermite interpolation: position, velocity and acceleration stay
    // continuous across the entire gesture, including the rebound between nods.
    const cubic = 10 * difference - 1.5 * fromAcceleration + 0.5 * toAcceleration
    const quartic = -15 * difference + 1.5 * fromAcceleration - toAcceleration
    const quintic = 6 * difference - 0.5 * fromAcceleration + 0.5 * toAcceleration
    const pitch = from.pitch + phase ** 2 * (fromAcceleration / 2 + phase * (cubic + phase * (quartic + phase * quintic)))
    return pitch * asciiMotion.maxNodPitchRadians
  }
  return 0
}

export function getAsciiNodRoll(elapsedSeconds: number) {
  if (elapsedSeconds <= 0 || elapsedSeconds >= asciiMotion.nodDurationSeconds) return 0
  const progress = elapsedSeconds / asciiMotion.nodDurationSeconds
  return Math.sin(Math.PI * progress) ** 2 * asciiMotion.maxNodRollRadians
}
