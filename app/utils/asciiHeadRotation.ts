import { Euler, Quaternion } from 'three'
import type { Object3D } from 'three'
import { asciiScene } from './asciiPortraitConfig'

export function createAsciiHeadRotation(model: Object3D) {
  const head = model.getObjectByName(asciiScene.headNodeName)
  if (!head) throw new Error(`ASCII portrait has no ${asciiScene.headNodeName} pivot`)
  const restRotation = head.quaternion.clone()
  const offset = new Quaternion()
  // Yaw about local Y, pitch about local X, then a small local Z lean.
  const angles = new Euler(0, 0, 0, 'YXZ')

  return (pitch: number, yaw: number, roll = 0) => {
    offset.setFromEuler(angles.set(pitch, yaw, roll))
    // Always compose with the exported pose; repeated frames must not accumulate turns.
    // HeadJoint inherits this movement through the original skin hierarchy.
    head.quaternion.copy(restRotation).multiply(offset)
  }
}
