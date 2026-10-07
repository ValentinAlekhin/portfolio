import { asciiMotion } from './asciiPortraitConfig'

interface AngularSpring {
  angle: number
  velocity: number
}

function advanceSpring(spring: AngularSpring, target: number, response: number, elapsedSeconds: number) {
  // Exact critical damping preserves momentum when the target changes and stays
  // stable at different frame rates. See theorangeduck.com/page/spring-roll-call.
  const displacement = spring.angle - target
  const impulse = spring.velocity + response * displacement
  const decay = Math.exp(-response * elapsedSeconds)
  spring.angle = target + (displacement + impulse * elapsedSeconds) * decay
  spring.velocity = (spring.velocity - response * impulse * elapsedSeconds) * decay
  const moving = Math.abs(spring.angle - target) > asciiMotion.rotationSnapThresholdRadians
    || Math.abs(spring.velocity) > asciiMotion.rotationRestSpeedRadiansPerSecond
  if (!moving) {
    spring.angle = target
    spring.velocity = 0
  }
  return moving
}

export function createAsciiHeadMotion() {
  const pitch: AngularSpring = { angle: 0, velocity: 0 }
  const yaw: AngularSpring = { angle: 0, velocity: 0 }
  const roll: AngularSpring = { angle: 0, velocity: 0 }

  return {
    get pitch() { return pitch.angle },
    get yaw() { return yaw.angle },
    get roll() { return roll.angle },
    update(targetPitch: number, targetYaw: number, elapsedSeconds: number) {
      const pitchMoving = advanceSpring(pitch, targetPitch, asciiMotion.pitchResponsePerSecond, elapsedSeconds)
      const yawMoving = advanceSpring(yaw, targetYaw, asciiMotion.yawResponsePerSecond, elapsedSeconds)
      // Follow the actual turn, so the small lean arrives after the main movement.
      const targetRoll = -yaw.angle / asciiMotion.maxYawRadians * asciiMotion.maxRollRadians
      const rollMoving = advanceSpring(roll, targetRoll, asciiMotion.rollResponsePerSecond, elapsedSeconds)
      return pitchMoving || yawMoving || rollMoving
    },
    reset() {
      for (const spring of [pitch, yaw, roll]) spring.angle = spring.velocity = 0
    },
  }
}
