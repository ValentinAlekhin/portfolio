import { asciiAssembly } from './asciiPortraitConfig'

export interface AsciiParticleLayout {
  // Normalized [x, y] origin pairs, one pair per character.
  origins: Float32Array
  // Normalized [start, finish] progress pairs, one pair per character.
  timing: Float32Array
  // [bendX, bendY, easingExponent] triples; bend coordinates use normalized UV units.
  curves: Float32Array
}

// Sample the surrounding space independently for each character. A nearest-edge
// assignment creates separate inward fronts and leaves the silhouette's medial
// axis visible as a gap while those fronts converge.
export function createAsciiParticleLayout(
  mask: Uint8Array,
  columns: number,
  rows: number,
  width: number,
  height: number,
  random: () => number = Math.random,
): AsciiParticleLayout {
  const count = columns * rows
  const cellWidth = width / columns
  const cellHeight = height / rows
  const exterior: number[] = []
  const clear = new Uint8Array(count)
  for (let index = 0; index < count; index++) {
    if (mask[index]) continue
    const x = index % columns
    const y = Math.floor(index / columns)
    let outside = true
    for (let dy = -asciiAssembly.originPaddingCells; dy <= asciiAssembly.originPaddingCells; dy++) {
      for (let dx = -asciiAssembly.originPaddingCells; dx <= asciiAssembly.originPaddingCells; dx++) {
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && nx < columns && ny >= 0 && ny < rows && mask[ny * columns + nx]) outside = false
      }
    }
    if (outside) clear[index] = 1
    exterior.push(index)
  }

  const origins = new Float32Array(count * 2)
  const timing = new Float32Array(count * 2)
  const curves = new Float32Array(count * 3)
  for (let index = 0; index < count; index++) {
    const x = (index % columns + 0.5) * cellWidth
    const y = (Math.floor(index / columns) + 0.5) * cellHeight
    let originX = x
    let originY = y
    let found = !mask[index]
    if (!found && exterior.length) {
      // Uniform area sampling in a local disk, rather than jittering one edge.
      // Keep the origin off the silhouette and allow diagonals and crossing paths.
      for (let attempt = 0; attempt < asciiAssembly.maxOriginAttempts; attempt++) {
        const angle = random() * Math.PI * 2
        const radius = Math.sqrt(asciiAssembly.minOriginDistancePx ** 2
          + random() * (asciiAssembly.maxOriginDistancePx ** 2 - asciiAssembly.minOriginDistancePx ** 2))
        const candidateX = x + Math.cos(angle) * radius
        const candidateY = y + Math.sin(angle) * radius
        if (candidateX < 0 || candidateX >= width || candidateY < 0 || candidateY >= height) continue
        if (!clear[Math.floor(candidateY / cellHeight) * columns + Math.floor(candidateX / cellWidth)]) continue
        originX = candidateX
        originY = candidateY
        found = true
        break
      }
      // Very thick silhouettes may have no exterior point within the radius.
      // Use Euclidean distance here; this fallback has no grid-axis preference.
      if (!found) {
        let closestDistance = Infinity
        for (const candidate of exterior) {
          const candidateX = (candidate % columns + 0.5) * cellWidth
          const candidateY = (Math.floor(candidate / columns) + 0.5) * cellHeight
          const distance = (candidateX - x) ** 2 + (candidateY - y) ** 2
          if (distance >= closestDistance) continue
          closestDistance = distance
          originX = candidateX
          originY = candidateY
        }
        found = true
      }
    }
    if (!found) {
      const edges = [
        { distance: x, x: -cellWidth / 2, y },
        { distance: width - x, x: width + cellWidth / 2, y },
        { distance: y, x, y: -cellHeight / 2 },
        { distance: height - y, x, y: height + cellHeight / 2 },
      ]
      const edge = edges.reduce((closest, candidate) => candidate.distance < closest.distance ? candidate : closest)
      originX = edge.x
      originY = edge.y
    }
    origins[index * 2] = originX / width
    origins[index * 2 + 1] = originY / height
    timing[index * 2] = random() * asciiAssembly.maxStartProgress
    timing[index * 2 + 1] = asciiAssembly.minFinishProgress + random() * (1 - asciiAssembly.minFinishProgress)

    const angle = random() * Math.PI * 2
    const distance = Math.hypot(originX - x, originY - y)
    const bend = Math.min(asciiAssembly.maxCurveBendPx, distance * asciiAssembly.maxCurveBendRatio)
      * (asciiAssembly.minCurveBendStrength + random() * (1 - asciiAssembly.minCurveBendStrength))
    curves[index * 3] = Math.cos(angle) * bend / width
    curves[index * 3 + 1] = Math.sin(angle) * bend / height
    curves[index * 3 + 2] = asciiAssembly.minEaseExponent
      + random() * (asciiAssembly.maxEaseExponent - asciiAssembly.minEaseExponent)
  }
  return { origins, timing, curves }
}
