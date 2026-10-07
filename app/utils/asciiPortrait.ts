import {
  AmbientLight,
  Box3,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  Float32BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  SkinnedMesh,
  Texture,
  UnsignedByteType,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three'
import type { Material, Object3D, Skeleton } from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { Pass } from 'three/addons/postprocessing/Pass.js'
import type { ResolvedTheme } from '~/types/content'
import { createAsciiParticleLayout } from '~/utils/asciiParticles'
import { createAsciiHeadRotation } from '~/utils/asciiHeadRotation'
import { asciiAssembly, asciiDensity, asciiGlyphAtlas, asciiRendering, asciiScene } from '~/utils/asciiPortraitConfig'

export interface AsciiPortraitRenderer {
  resize: (width: number, height: number) => void
  setTheme: (ink: string, theme: ResolvedTheme) => void
  setRotation: (pitch: number, yaw: number, roll: number) => void
  setAssemblyProgress: (progress: number) => void
  render: () => void
  dispose: () => void
}

// The atlas supplies coverage only; the shader applies the current theme's ink.
const glyphCoverageColor = '#fff'
// readRenderTargetPixels returns interleaved RGBA bytes, with alpha last.
const rgbaChannels = 4
const alphaChannelIndex = 3

class AsciiParticlePass extends Pass {
  private readonly scene = new Scene()
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private readonly geometry = new InstancedBufferGeometry()
  private readonly material: ShaderMaterial
  private originsReady = false
  private width = 0
  private height = 0
  readonly uniforms: {
    tDiffuse: { value: Texture | null }
    glyphs: { value: CanvasTexture }
    glyphCount: { value: number }
    grid: { value: Vector2 }
    ink: { value: Color }
    lightTheme: { value: boolean }
    progress: { value: number }
    densityExponent: { value: number }
    alphaCutoff: { value: number }
    luminanceWeights: { value: Vector3 }
    initialGlyphScale: { value: number }
  }

  constructor(glyphs: CanvasTexture) {
    super()
    this.uniforms = {
      tDiffuse: { value: null },
      glyphs: { value: glyphs },
      glyphCount: { value: asciiDensity.characters.length },
      grid: { value: new Vector2() },
      ink: { value: new Color() },
      lightTheme: { value: true },
      progress: { value: 0 },
      densityExponent: { value: asciiDensity.toneExponent },
      alphaCutoff: { value: asciiDensity.alphaCutoff },
      luminanceWeights: { value: new Vector3(...asciiDensity.luminanceWeights) },
      initialGlyphScale: { value: asciiAssembly.initialGlyphScale },
    }
    // Two triangles form a unit quad; UV pairs cover exactly one atlas glyph.
    this.geometry.setAttribute('position', new Float32BufferAttribute([
      -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0,
      -0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0,
    ], 3))
    this.geometry.setAttribute('uv', new Float32BufferAttribute([
      0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
    ], 2))
    this.material = new ShaderMaterial({
      name: 'AsciiPortraitParticles',
      uniforms: this.uniforms,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      premultipliedAlpha: true,
      vertexShader: `
        attribute vec2 targetUv;
        attribute vec2 originUv;
        attribute vec2 timing;
        attribute vec3 curve;
        uniform vec2 grid;
        uniform float progress;
        uniform float initialGlyphScale;
        varying vec2 vUv;
        varying vec2 vTargetUv;
        varying float vOpacity;

        void main() {
          vUv = uv;
          vTargetUv = targetUv;
          float phase = clamp((progress - timing.x) / (timing.y - timing.x), 0.0, 1.0);
          float eased = 1.0 - pow(1.0 - phase, curve.z);
          vec2 destination = targetUv * 2.0 - 1.0;
          vec2 origin = originUv * 2.0 - 1.0;
          vec2 center = mix(origin, destination, eased);
          // 4t(1-t) has a unit peak and vanishes at both trajectory endpoints.
          center += curve.xy * 2.0 * (4.0 * eased * (1.0 - eased));
          float scale = mix(initialGlyphScale, 1.0, eased);
          vOpacity = smoothstep(0.0, 1.0, phase);
          gl_Position = vec4(center + position.xy * 2.0 / grid * scale, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D glyphs;
        uniform float glyphCount;
        uniform vec3 ink;
        uniform bool lightTheme;
        uniform float densityExponent;
        uniform float alphaCutoff;
        uniform vec3 luminanceWeights;
        varying vec2 vUv;
        varying vec2 vTargetUv;
        varying float vOpacity;

        void main() {
          vec4 sampleColor = texture2D(tDiffuse, vTargetUv);
          if (sampleColor.a < alphaCutoff) discard;
          vec3 displayColor = sRGBTransferOETF(sampleColor).rgb;
          float brightness = clamp(dot(displayColor, luminanceWeights), 0.0, 1.0);
          float density = pow(lightTheme ? 1.0 - brightness : brightness, densityExponent);
          float index = floor(density * (glyphCount - 1.0) + 0.5);
          vec2 glyphUv = vec2((index + vUv.x) / glyphCount, vUv.y);
          vec2 glyphScale = vec2(glyphCount, 1.0);
          float coverage = textureGrad(glyphs, glyphUv, dFdx(vUv) / glyphScale, dFdy(vUv) / glyphScale).a;
          gl_FragColor = vec4(ink, coverage * sampleColor.a * vOpacity);
          #include <colorspace_fragment>
          #include <premultiplied_alpha_fragment>
        }
      `,
    })
    const particles = new Mesh(this.geometry, this.material)
    particles.frustumCulled = false
    this.scene.add(particles)
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
    // Distribute the count multiplier over both axes, preserving glyph proportions.
    const densityScale = Math.sqrt(asciiDensity.characterCountMultiplier)
    const columns = Math.max(1, Math.floor(width / asciiDensity.cellWidthPx * densityScale))
    const rows = Math.max(1, Math.floor(height / asciiDensity.cellHeightPx * densityScale))
    if (this.uniforms.grid.value.equals(new Vector2(columns, rows))) return
    const targets = new Float32Array(columns * rows * 2)
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const offset = (row * columns + column) * 2
        targets[offset] = (column + 0.5) / columns
        targets[offset + 1] = (row + 0.5) / rows
      }
    }
    // Replacing an uploaded attribute must also release its old GPU buffer.
    this.geometry.dispose()
    this.geometry.setAttribute('targetUv', new InstancedBufferAttribute(targets, 2))
    this.geometry.instanceCount = columns * rows
    this.uniforms.grid.value.set(columns, rows)
    this.originsReady = false
  }

  private prepareOrigins(renderer: WebGLRenderer, source: WebGLRenderTarget) {
    const { x: columns, y: rows } = this.uniforms.grid.value
    const pixels = new Uint8Array(source.width * source.height * rgbaChannels)
    renderer.readRenderTargetPixels(source, 0, 0, source.width, source.height, pixels)
    const mask = new Uint8Array(columns * rows)
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const x = Math.floor((column + 0.5) / columns * source.width)
        const y = Math.floor((row + 0.5) / rows * source.height)
        mask[row * columns + column] = pixels[(y * source.width + x) * rgbaChannels + alphaChannelIndex]! > 0 ? 1 : 0
      }
    }
    const layout = createAsciiParticleLayout(mask, columns, rows, this.width, this.height)
    this.geometry.setAttribute('originUv', new InstancedBufferAttribute(layout.origins, 2))
    this.geometry.setAttribute('timing', new InstancedBufferAttribute(layout.timing, 2))
    this.geometry.setAttribute('curve', new InstancedBufferAttribute(layout.curves, 3))
    this.originsReady = true
  }

  override render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget) {
    this.uniforms.tDiffuse.value = readBuffer.texture
    if (!this.originsReady) this.prepareOrigins(renderer, readBuffer)
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer)
    renderer.clear()
    renderer.render(this.scene, this.camera)
  }

  override dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}

function createGlyphTexture(fontFamily: string) {
  const canvas = document.createElement('canvas')
  canvas.width = asciiDensity.characters.length * asciiGlyphAtlas.cellWidthPx
  canvas.height = asciiGlyphAtlas.cellHeightPx
  const context = canvas.getContext('2d')
  if (!context) throw new Error('ASCII glyph canvas is unavailable')
  context.font = `${asciiGlyphAtlas.fontWeight} ${asciiGlyphAtlas.fontSizePx}px ${fontFamily}`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = glyphCoverageColor
  for (let index = 0; index < asciiDensity.characters.length; index++) {
    context.fillText(asciiDensity.characters[index]!, (index + 0.5) * asciiGlyphAtlas.cellWidthPx, asciiGlyphAtlas.cellHeightPx / 2)
  }
  return new CanvasTexture(canvas)
}

function disposeModel(root: Object3D) {
  const materials = new Set<Material>()
  const textures = new Set<Texture>()
  const skeletons = new Set<Skeleton>()
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return
    if (object instanceof SkinnedMesh) skeletons.add(object.skeleton)
    object.geometry.dispose()
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material)
    }
  })
  for (const skeleton of skeletons) skeleton.dispose()
  for (const material of materials) {
    for (const value of Object.values(material)) {
      if (value instanceof Texture) textures.add(value)
    }
    material.dispose()
  }
  for (const texture of textures) {
    texture.dispose()
    const image: unknown = texture.source.data
    if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) image.close()
  }
}

// This module is imported only when the desktop portrait enters the viewport.
export async function createAsciiPortrait(
  canvas: HTMLCanvasElement,
  data: ArrayBuffer,
  fontFamily: string,
): Promise<AsciiPortraitRenderer> {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
  renderer.setClearColor(0, 0)
  renderer.debug.onShaderError = () => {
    throw new Error('ASCII portrait shader could not compile')
  }
  let model: Group | undefined
  let glyphs: CanvasTexture | undefined
  let composer: EffectComposer | undefined
  let asciiPass: AsciiParticlePass | undefined
  let disposed = false

  function dispose() {
    if (disposed) return
    disposed = true
    if (model) disposeModel(model)
    glyphs?.dispose()
    asciiPass?.dispose()
    composer?.dispose()
    renderer.dispose()
  }

  try {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
    model = (await loader.parseAsync(data, '')).scene
    const rotateHead = createAsciiHeadRotation(model)
    // Frame the entire scan with an external group, preserving every exported transform.
    const portrait = new Group()
    portrait.rotation.y = asciiScene.modelYawRadians
    portrait.add(model)
    const bounds = new Box3().setFromObject(portrait)
    const size = bounds.getSize(new Vector3())
    portrait.position.sub(bounds.getCenter(new Vector3()))
    const scene = new Scene()
    scene.add(portrait, new AmbientLight(asciiScene.lightColor, asciiScene.ambientLightIntensity))
    const keyLight = new DirectionalLight(asciiScene.lightColor, asciiScene.keyLightIntensity)
    keyLight.position.set(...asciiScene.keyLightPosition)
    scene.add(keyLight)
    const camera = new OrthographicCamera(-1, 1, 1, -1, asciiScene.cameraNear, asciiScene.cameraFar)
    camera.position.set(0, 0, size.length() * asciiScene.cameraDistanceMultiplier)
    camera.lookAt(0, 0, 0)

    glyphs = createGlyphTexture(fontFamily)
    asciiPass = new AsciiParticlePass(glyphs)
    const particles = asciiPass
    const { uniforms } = particles
    composer = new EffectComposer(renderer, new WebGLRenderTarget(1, 1, { type: UnsignedByteType }))
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(asciiPass)
    const effect = composer

    return {
      resize(width, height) {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, asciiRendering.maxPixelRatio)
        renderer.setPixelRatio(pixelRatio)
        renderer.setSize(width, height, false)
        effect.setPixelRatio(pixelRatio)
        effect.setSize(width, height)
        const aspect = width / height
        const viewHeight = Math.max(size.y, size.x / aspect) * asciiScene.framingScale
        camera.left = -viewHeight * aspect / 2
        camera.right = viewHeight * aspect / 2
        camera.top = viewHeight / 2
        camera.bottom = -viewHeight / 2
        camera.updateProjectionMatrix()
        particles.resize(width, height)
      },
      setTheme(ink, theme) {
        uniforms.ink.value.set(ink)
        uniforms.lightTheme.value = theme === 'light'
      },
      setRotation(pitch, yaw, roll) {
        rotateHead(pitch, yaw, roll)
      },
      setAssemblyProgress(progress) {
        uniforms.progress.value = progress
      },
      render() {
        if (renderer.getContext().isContextLost()) throw new Error('ASCII portrait context was lost')
        effect.render()
      },
      dispose,
    }
  }
  catch (error) {
    dispose()
    throw error
  }
}
