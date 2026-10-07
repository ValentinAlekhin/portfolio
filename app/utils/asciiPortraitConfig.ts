export const asciiDensity = {
  // Width of one character in CSS pixels. Increase it for fewer columns and less detail.
  cellWidthPx: 3,
  // Height of one character in CSS pixels. Increase it for fewer rows and less detail.
  cellHeightPx: 5,
  // Relative character count; 1.25 adds 25% more cells while keeping their proportions.
  characterCountMultiplier: 1.25,
  // Glyphs ordered from empty to dense; their order determines the tonal ramp.
  characters: ' .:-=+*#%@',
  // Values below 1 give midtones denser glyphs, helping the face remain readable.
  toneExponent: 0.65,
  // Ignore almost transparent model pixels when choosing visible characters.
  alphaCutoff: 0.01,
  // Rec. 709 RGB weights used to convert the rendered model into brightness.
  luminanceWeights: [0.2126, 0.7152, 0.0722],
} as const

export const asciiGlyphAtlas = {
  // Raster atlas resolution per glyph, independent of the portrait's CSS cell size.
  cellWidthPx: 32,
  cellHeightPx: 64,
  // A large, bold source glyph stays legible after downsampling to the ASCII grid.
  fontSizePx: 48,
  fontWeight: 700,
} as const

export const asciiAssembly = {
  // Total intro duration in seconds; individual characters finish within this interval.
  durationSeconds: 1.6,
  // Latest random start, expressed as a fraction of the total intro duration.
  maxStartProgress: 0.25,
  // Earliest random finish, expressed as a fraction of the total intro duration.
  minFinishProgress: 0.65,
  // Local source disk in CSS pixels; distant characters never cross the whole frame.
  minOriginDistancePx: 24,
  maxOriginDistancePx: 180,
  // Bound initialization work before falling back to the nearest exterior point.
  maxOriginAttempts: 64,
  // Leave this many empty cells between a sampled origin and the model silhouette.
  originPaddingCells: 1,
  // Limit drift in CSS pixels and relative to travel distance, keeping paths local.
  maxCurveBendPx: 48,
  maxCurveBendRatio: 0.24,
  // Random bend strength ranges from this fraction to the full allowed bend.
  minCurveBendStrength: 0.35,
  // Vary deceleration per character to avoid a shared advancing front.
  minEaseExponent: 2.2,
  maxEaseExponent: 4.2,
  // Characters grow from this fraction of their final size as they assemble.
  initialGlyphScale: 0.65,
} as const

export const asciiRendering = {
  // Matches the desktop portrait's CSS breakpoint; smaller screens skip WebGL entirely.
  desktopMinWidthPx: 1024,
  // Cap animation work without changing the grid's spatial density.
  maxFramesPerSecond: 30,
  // Clamp elapsed time after stalls so rotation and assembly cannot jump abruptly.
  maxFrameDeltaSeconds: 0.1,
  // Limit framebuffer resolution on high-DPI displays, independently of ASCII cell size.
  maxPixelRatio: 2,
} as const

export const asciiMotion = {
  // Maximum horizontal and vertical turns: 12° and 6°, expressed in radians.
  maxYawRadians: Math.PI / 15,
  maxPitchRadians: Math.PI / 30,
  // Critical spring response in inverse seconds: yaw leads pitch, then a tiny roll follows.
  yawResponsePerSecond: 16,
  pitchResponsePerSecond: 14,
  rollResponsePerSecond: 11,
  // A 0.4° sideways lean gives turns a subtle arc without obscuring the face.
  maxRollRadians: Math.PI / 450,
  // Snap imperceptible angular differences to the target and stop rendering at rest.
  rotationSnapThresholdRadians: 0.0001,
  // Also wait for angular speed to settle before snapping, in radians per second.
  rotationRestSpeedRadiansPerSecond: 0.001,
  // Complete the affirmative gesture in this many seconds.
  nodDurationSeconds: 1.05,
  // A restrained first nod reaches 2.5°; the second reaches at most 1.75°.
  maxNodPitchRadians: Math.PI / 72,
  // A 0.2° roll overlaps both nods as one gentle arc, rather than repeating per beat.
  maxNodRollRadians: Math.PI / 900,
  // Vary each complete gesture slightly; the first nod never exceeds the 2.5° limit.
  minNodStrength: 0.9,
  minNodSpeed: 0.96,
  maxNodSpeed: 1.04,
  // Time is normalized to the whole gesture; pitch is relative to its maximum angle.
  // Positive values lift the chin: anticipation, first nod, rebound, second nod, settle.
  // The connected curve crosses neutral without stopping between the two nods.
  nodKeyframes: [
    { time: 0, pitch: 0 },
    { time: 0.07, pitch: 0.07 },
    { time: 0.26, pitch: -1 },
    { time: 0.47, pitch: 0.06 },
    { time: 0.68, pitch: -0.7 },
    { time: 0.88, pitch: 0.02 },
    { time: 1, pitch: 0 },
  ],
} as const

export const asciiScene = {
  // Optimized public asset; source scans stay out of the browser bundle.
  modelUrl: '/models/portrait-ascii.glb',
  // Exported pivot controlling the head and its child neck joint.
  headNodeName: 'Head',
  // The scan faces backwards in its original coordinate system.
  modelYawRadians: Math.PI,
  // Neutral illumination keeps the model's luminance independent of the UI theme.
  lightColor: 0xffffff,
  // Ambient fill and directional key preserve facial features in the scan texture.
  ambientLightIntensity: 1,
  keyLightIntensity: 1,
  // Key light position in scene coordinates, above and to the left of the camera.
  keyLightPosition: [-2, 3, 4],
  // Camera clipping distances in model units.
  cameraNear: 0.01,
  cameraFar: 100,
  // Position the camera this many model diagonals away from the centered scan.
  cameraDistanceMultiplier: 3,
  // Multiply the fitted orthographic bounds by this factor to leave framing space.
  framingScale: 1.05,
} as const
