import { describe, expect, it } from 'vitest'
import {
  Bone, BufferGeometry, Euler, Float32BufferAttribute, Group,
  MeshBasicMaterial, Quaternion, Skeleton, SkinnedMesh, Uint16BufferAttribute, Vector3,
} from 'three'
import { createAsciiHeadRotation } from '../app/utils/asciiHeadRotation'

describe('ASCII head rotation', () => {
  it('composes local turns with the exported pose without moving its pivot or accumulating rotation', () => {
    const model = new Group()
    const head = new Group()
    head.name = 'Head'
    head.position.set(0.2, 1, -0.1)
    head.scale.set(0.9, 1.1, 1)
    head.rotation.set(0.1, -0.2, 0.3)
    model.add(head)
    const restRotation = head.quaternion.clone()
    const restPosition = head.position.clone()
    const restScale = head.scale.clone()
    const rotate = createAsciiHeadRotation(model)
    rotate(0.15, 0.2, 0.01)
    const turned = head.quaternion.clone()
    const expected = restRotation.clone().multiply(new Quaternion().setFromEuler(new Euler(0.15, 0.2, 0.01, 'YXZ')))
    expect(turned.toArray()).toEqual(expected.toArray())
    rotate(0.15, 0.2, 0.01)
    expect(head.quaternion.equals(turned)).toBe(true)
    expect(head.position.equals(restPosition)).toBe(true)
    expect(head.scale.equals(restScale)).toBe(true)
    rotate(0, 0)
    expect(head.quaternion.equals(restRotation)).toBe(true)
  })

  it('lets the neck skin follow Head while preserving torso vertices and bone-local transforms', () => {
    const model = new Group()
    const head = new Group()
    head.name = 'Head'
    head.position.y = 1
    const headJoint = new Bone()
    headJoint.name = 'HeadJoint'
    headJoint.rotation.x = -Math.PI / 2
    head.add(headJoint)
    const torso = new Bone()
    torso.name = 'Torso'
    torso.rotation.x = -Math.PI / 2
    const neckRig = new Group()
    const geometry = new BufferGeometry()
      .setAttribute('position', new Float32BufferAttribute([0, 0, 0, 0, 2, 0], 3))
      .setAttribute('skinIndex', new Uint16BufferAttribute([0, 0, 0, 0, 1, 0, 0, 0], 4))
      .setAttribute('skinWeight', new Float32BufferAttribute([1, 0, 0, 0, 1, 0, 0, 0], 4))
    const material = new MeshBasicMaterial()
    const body = new SkinnedMesh(geometry, material)
    neckRig.add(body, torso)
    model.add(head, neckRig)
    model.updateMatrixWorld(true)
    body.bind(new Skeleton([torso, headJoint]))
    body.skeleton.update()
    const lowerBefore = body.getVertexPosition(0, new Vector3())
    const upperBefore = body.getVertexPosition(1, new Vector3())
    const jointRest = headJoint.matrix.clone()
    const torsoRest = torso.matrixWorld.clone()
    const inverseBindings = body.skeleton.boneInverses.map(matrix => matrix.toArray())
    createAsciiHeadRotation(model)(0.15, 0.2, 0.01)
    model.updateMatrixWorld(true)
    body.skeleton.update()
    expect(body.getVertexPosition(0, new Vector3()).equals(lowerBefore)).toBe(true)
    expect(body.getVertexPosition(1, new Vector3()).distanceTo(upperBefore)).toBeGreaterThan(0.1)
    expect(headJoint.parent).toBe(head)
    expect(headJoint.matrix.equals(jointRest)).toBe(true)
    expect(torso.matrixWorld.equals(torsoRest)).toBe(true)
    expect(body.skeleton.boneInverses.map(matrix => matrix.toArray())).toEqual(inverseBindings)
    geometry.dispose()
    material.dispose()
    body.skeleton.dispose()
  })

  it('rejects an asset without the authored Head pivot', () => {
    expect(() => createAsciiHeadRotation(new Group())).toThrow('Head pivot')
  })
})
