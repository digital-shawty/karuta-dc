// A PNG codec small enough to keep the checks dependency-free.
//
// Decodes 8- and 16-bit greyscale, RGB, palette and alpha variants into RGBA,
// and writes RGBA back out. No interlacing, which nothing here produces.
// Exists so the frame matcher can be run under Node against real card images
// instead of only in a browser.

import { deflateSync, inflateSync } from 'node:zlib'

export interface Png { width: number, height: number, data: Uint8ClampedArray }

const SIGNATURE = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(bytes: Uint8Array): number {
  let c = 0xFFFFFFFF
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xFF]! ^ (c >>> 8)
  return (c ^ 0xFFFFFFFF) >>> 0
}

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
}

export function decodePng(file: Uint8Array): Png {
  for (let i = 0; i < 8; i++) {
    if (file[i] !== SIGNATURE[i]) throw new Error('not a PNG')
  }

  const view = new DataView(file.buffer, file.byteOffset, file.byteLength)
  let width = 0
  let height = 0
  let depth = 8
  let type = 6
  let palette: Uint8Array | undefined
  let trns: Uint8Array | undefined
  const idat: Uint8Array[] = []

  for (let at = 8; at < file.length;) {
    const length = view.getUint32(at)
    const tag = String.fromCharCode(...file.subarray(at + 4, at + 8))
    const body = file.subarray(at + 8, at + 8 + length)
    if (tag === 'IHDR') {
      width = view.getUint32(at + 8)
      height = view.getUint32(at + 12)
      depth = file[at + 16]!
      type = file[at + 17]!
      if (file[at + 20] !== 0) throw new Error('interlaced PNGs are not supported')
    }
    else if (tag === 'PLTE') palette = body
    else if (tag === 'tRNS') trns = body
    else if (tag === 'IDAT') idat.push(body)
    else if (tag === 'IEND') break
    at += 12 + length
  }

  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[type]
  if (!channels) throw new Error(`unsupported colour type ${type}`)
  if (depth !== 8 && depth !== 16 && type !== 3) throw new Error(`unsupported bit depth ${depth}`)

  const raw = inflateSync(Buffer.concat(idat.map(c => Buffer.from(c))))
  const bytesPerSample = depth === 16 ? 2 : 1
  const bpp = Math.max(1, Math.ceil(channels * depth / 8))
  const stride = Math.ceil(width * channels * depth / 8)

  // Undo the per-row filters in place.
  const rows = new Uint8Array(stride * height)
  let prev = new Uint8Array(stride)
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]!
    const row = rows.subarray(y * stride, (y + 1) * stride)
    row.set(raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)))
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? row[x - bpp]! : 0
      const b = prev[x]!
      const c = x >= bpp ? prev[x - bpp]! : 0
      switch (filter) {
        case 1: row[x] = (row[x]! + a) & 0xFF; break
        case 2: row[x] = (row[x]! + b) & 0xFF; break
        case 3: row[x] = (row[x]! + ((a + b) >> 1)) & 0xFF; break
        case 4: row[x] = (row[x]! + paeth(a, b, c)) & 0xFF; break
      }
    }
    prev = row
  }

  const data = new Uint8ClampedArray(width * height * 4)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4
      if (type === 3) {
        const bits = depth
        const perByte = 8 / bits
        const byte = rows[y * stride + Math.floor(x / perByte)]!
        const shift = 8 - bits * ((x % perByte) + 1)
        const index = (byte >> shift) & ((1 << bits) - 1)
        data[o] = palette![index * 3]!
        data[o + 1] = palette![index * 3 + 1]!
        data[o + 2] = palette![index * 3 + 2]!
        data[o + 3] = trns && index < trns.length ? trns[index]! : 255
        continue
      }
      const at = y * stride + x * channels * bytesPerSample
      const sample = (n: number) => rows[at + n * bytesPerSample]!
      if (type === 0) {
        data[o] = data[o + 1] = data[o + 2] = sample(0)
        data[o + 3] = 255
      }
      else if (type === 2) {
        data[o] = sample(0); data[o + 1] = sample(1); data[o + 2] = sample(2); data[o + 3] = 255
      }
      else if (type === 4) {
        data[o] = data[o + 1] = data[o + 2] = sample(0)
        data[o + 3] = sample(1)
      }
      else {
        data[o] = sample(0); data[o + 1] = sample(1); data[o + 2] = sample(2); data[o + 3] = sample(3)
      }
    }
  }
  return { width, height, data }
}

export function encodePng({ width, height, data }: Png): Buffer {
  const raw = Buffer.alloc((width * 4 + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0
    raw.set(data.subarray(y * width * 4, (y + 1) * width * 4), y * (width * 4 + 1) + 1)
  }
  const chunk = (tag: string, body: Buffer) => {
    const head = Buffer.alloc(4)
    head.writeUInt32BE(body.length)
    const tagged = Buffer.concat([Buffer.from(tag, 'latin1'), body])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(tagged))
    return Buffer.concat([head, tagged, crc])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0
  return Buffer.concat([
    Buffer.from(SIGNATURE),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}
