import { deepStrictEqual } from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions'
import { textureCompress } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import sharp from 'sharp'

const portraitOptimization = {
  // Texture dimensions in pixels: sufficient source detail for the desktop ASCII grid.
  textureSizePx: 1024,
  // WebP quality balances recognizable facial features against asset transfer size.
  textureQuality: 85,
}

// Binary mebibytes, used only for the optimization report.
const bytesPerMebibyte = 1024 ** 2

// Keep authoring files outside public; only the optimized GLB is served to visitors.
const source = resolve(process.argv[2] || 'app/assets/models/portrait/portrait.glb')
const destination = resolve('public/models/portrait-ascii.glb')
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder })

await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready])
const document = await io.read(source)
const rigBefore = snapshotRig(document)
if (!document.getRoot().listNodes().some(node => node.getName() === 'Head')) {
  throw new Error('Portrait source must contain the exported Head pivot')
}

// The scan's metallic map obscures the face without an environment map.
for (const material of document.getRoot().listMaterials()) {
  material.setMetallicFactor(0).setRoughnessFactor(1).setMetallicRoughnessTexture(null)
}

await document.transform(
  textureCompress({
    encoder: sharp,
    targetFormat: 'webp',
    resize: [portraitOptimization.textureSizePx, portraitOptimization.textureSizePx],
    quality: portraitOptimization.textureQuality,
  }),
)

// Apply the lossless codec directly, without meshopt()'s quantization or any
// simplification, flattening or welding that could change the authored rig.
document.createExtension(EXTMeshoptCompression)
  .setRequired(true)
  .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE })
const binary = await io.writeBinary(document)
deepStrictEqual(snapshotRig(await io.readBinary(binary)), rigBefore, 'Portrait compression changed the rig')
await mkdir(dirname(destination), { recursive: true })
await writeFile(destination, binary)
const triangles = document.getRoot().listMeshes().reduce((total, mesh) => total + mesh.listPrimitives()
  .reduce((count, primitive) => count + primitive.getIndices().getCount() / 3, 0), 0)
const { size } = await stat(destination)
process.stdout.write(`Portrait: ${triangles.toLocaleString('en-US')} triangles, ${(size / bytesPerMebibyte).toFixed(2)} MiB\n`)

function snapshotRig(document) {
  const root = document.getRoot()
  const hashAccessor = (accessor) => {
    const array = accessor?.getArray()
    if (!array) return null
    return createHash('sha256').update(Buffer.from(array.buffer, array.byteOffset, array.byteLength)).digest('hex')
  }
  return {
    nodes: root.listNodes().map(node => ({
      name: node.getName(),
      parent: node.getParentNode()?.getName(),
      children: node.listChildren().map(child => child.getName()),
      translation: node.getTranslation(),
      rotation: node.getRotation(),
      scale: node.getScale(),
      skin: node.getSkin()?.getName(),
      mesh: node.getMesh()?.getName(),
    })),
    skins: root.listSkins().map(skin => ({
      name: skin.getName(),
      skeleton: skin.getSkeleton()?.getName(),
      joints: skin.listJoints().map(joint => joint.getName()),
      inverseBindMatrices: hashAccessor(skin.getInverseBindMatrices()),
    })),
    meshes: root.listMeshes().map(mesh => ({
      name: mesh.getName(),
      primitives: mesh.listPrimitives().map(primitive => ({
        triangles: primitive.getIndices().getCount() / 3,
        attributes: Object.fromEntries(primitive.listSemantics().map(semantic => [
          semantic, hashAccessor(primitive.getAttribute(semantic)),
        ])),
      })),
    })),
  }
}
