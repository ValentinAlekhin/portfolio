const pngSignature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
const pixelsPerInchInMetre = 39.37007874015748
let crcTable: Uint32Array | undefined

interface PngChunk {
  bytes: Uint8Array
  type: string
}

function getCrcTable(): Uint32Array {
  if (crcTable) return crcTable

  crcTable = new Uint32Array(256)
  for (let index = 0; index < 256; index += 1) {
    let value = index
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) === 1
        ? 0xedb88320 ^ (value >>> 1)
        : value >>> 1
    }
    crcTable[index] = value >>> 0
  }

  return crcTable
}

function calculateCrc(bytes: Uint8Array): number {
  const table = getCrcTable()
  let crc = 0xffffffff

  for (const byte of bytes) {
    crc = table[(crc ^ byte) & 0xff]! ^ (crc >>> 8)
  }

  return (crc ^ 0xffffffff) >>> 0
}

function assertPngSignature(bytes: Uint8Array): void {
  if (bytes.length < pngSignature.length) {
    throw new Error('Invalid PNG data')
  }

  for (let index = 0; index < pngSignature.length; index += 1) {
    if (bytes[index] !== pngSignature[index]) {
      throw new Error('Invalid PNG signature')
    }
  }
}

function readChunkType(bytes: Uint8Array, offset: number): string {
  return String.fromCharCode(
    bytes[offset + 4]!,
    bytes[offset + 5]!,
    bytes[offset + 6]!,
    bytes[offset + 7]!,
  )
}

function parseChunks(bytes: Uint8Array): PngChunk[] {
  const chunks: PngChunk[] = []
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let offset = pngSignature.length

  while (offset + 12 <= bytes.length) {
    const dataLength = view.getUint32(offset)
    const chunkLength = dataLength + 12
    const end = offset + chunkLength

    if (end > bytes.length) {
      throw new Error('Invalid PNG chunk length')
    }

    const type = readChunkType(bytes, offset)
    chunks.push({
      bytes: bytes.slice(offset, end),
      type,
    })
    offset = end

    if (type === 'IEND') break
  }

  if (!chunks.some(chunk => chunk.type === 'IHDR')
    || !chunks.some(chunk => chunk.type === 'IEND')) {
    throw new Error('Incomplete PNG data')
  }

  return chunks
}

function createPhysicalDimensionsChunk(dpi: number): Uint8Array {
  const pixelsPerMetre = Math.round(dpi * pixelsPerInchInMetre)
  const chunk = new Uint8Array(21)
  const view = new DataView(chunk.buffer)

  view.setUint32(0, 9)
  chunk.set([112, 72, 89, 115], 4)
  view.setUint32(8, pixelsPerMetre)
  view.setUint32(12, pixelsPerMetre)
  chunk[16] = 1
  view.setUint32(17, calculateCrc(chunk.subarray(4, 17)))

  return chunk
}

function concatenate(parts: Uint8Array[]): Uint8Array {
  const output = new Uint8Array(parts.reduce((length, part) => length + part.length, 0))
  let offset = 0

  for (const part of parts) {
    output.set(part, offset)
    offset += part.length
  }

  return output
}

export function setPngDpi(bytes: Uint8Array, dpi: number): Uint8Array {
  if (!Number.isFinite(dpi) || dpi <= 0) {
    throw new Error('DPI must be a positive number')
  }

  assertPngSignature(bytes)
  const chunks = parseChunks(bytes)
  const densityChunk = createPhysicalDimensionsChunk(dpi)
  const output: Uint8Array[] = [pngSignature]

  for (const chunk of chunks) {
    if (chunk.type === 'pHYs') continue
    output.push(chunk.bytes)
    if (chunk.type === 'IHDR') output.push(densityChunk)
  }

  return concatenate(output)
}

export async function setPngBlobDpi(blob: Blob, dpi: number): Promise<Blob> {
  const bytes = setPngDpi(new Uint8Array(await blob.arrayBuffer()), dpi)
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer

  return new Blob([buffer], { type: 'image/png' })
}
