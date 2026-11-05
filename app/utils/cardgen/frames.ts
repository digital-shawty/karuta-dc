// Recognising which frame a card uses, so its code can be masked exactly.
//
// Every card the bot makes sits in one of a few hundred frames, and each frame
// prints the code and the edition numbers onto solid bars at fixed positions.
// Those bars move a long way between frames: the code bar's centre runs from a
// seventh to seven eighths of the way across. No single default box can cover
// that, so the frame is identified and its own plates are used.
//
// Three things make this work on a real card rather than a bare template:
//
//   lightness   the bot dyes every frame to the card's theme, so a card's
//               colours say nothing about its frame. Celestial is blue and
//               gold as a template and solid green on a card. The pattern of
//               light and dark in the border survives the dye, so only
//               lightness is compared, and compared by correlation so a dye
//               that darkens or brightens the whole frame does not matter.
//
//   the ring    only the border is compared, weighted by how much of each
//               cell is artwork. The middle of a template is empty while the
//               middle of a real card is character art.
//
//   the inset   every card the bot makes is the same shape: the frame sits ten
//               pixels in from each edge of a 274 x 405 image, with a glow in
//               the margin. There is nothing to search for, which is what
//               makes the match a few milliseconds and the mask exact.

import { FRAME_DATA, FRAME_PRINT } from './frame-data'
import { loadImage, publicUrl } from './images'
import { CARD, type Rect } from './types'

export interface FrameMatch {
  id: string
  /** Correlation with the frame's border, 1 is identical. Higher is better. */
  score: number
  /** Where the frame sits in the image, as fractions of its width and height. */
  inset: { x: number, y: number, w: number, h: number }
  /** How unusual this frame's plates looked when they were measured. */
  confidence: number
  /** The plate outlines, to be drawn over the card. */
  maskUrl: string
  /** Bounding boxes of the same plates, for the editor and as a fallback. */
  redactions: Rect[]
}

interface FrameRow {
  id: string
  top: number[]
  bottom: number[]
  score: number
}

/** The library, as read off the sprite. Frame i's ring is at i * RING_LEN. */
export interface FrameTable {
  frames: FrameRow[]
  /** Lightness of each frame's ring, 0 to 255. */
  prints: Uint8Array
  /** How much of each ring cell is border rather than empty middle, 0 to 255. */
  weights: Uint8Array
}

/**
 * Where the frame sits on a card the bot made.
 * Measured on real cards: a 254 x 380 frame centred on a 274 x 405 image, the
 * ten pixel margin holding the glow. Every card checked sat within a pixel.
 */
export const FRAME_INSET = {
  x: 10 / CARD.w,
  y: 10 / CARD.h,
  w: 254 / CARD.w,
  h: 380 / CARD.h,
} as const

/**
 * Whether a match is believed.
 *
 * Measured on ten real cards against the whole library. The right frame
 * scored 0.52 to 0.94 and led the nearest frame with different plates by
 * 0.19 to 0.50. With the right frame removed from the library, the best
 * wrong answer led by no more than 0.09. The margin is what separates them;
 * the floor on the score is only a backstop.
 *
 * A wrong frame would put the mask somewhere else entirely and leave the code
 * on display, so the thresholds err towards turning a card away. A card
 * turned away falls back to scanning for its bars, which still covers them.
 */
const ACCEPT_MIN = 0.45
const ACCEPT_MARGIN = 0.12
/**
 * Two frames whose plates sit within this many card pixels of each other are
 * not rivals: confusing them changes nothing about where the mask lands.
 * Lets a frame that was uploaded twice, or siblings that share a layout,
 * through without a fight.
 */
const PLATE_TOLERANCE = 6
/**
 * A frame with less border than this in its ring is compared on almost
 * nothing, so its score is noise.
 */
const MIN_WEIGHT = 0.05
/** How many frames are ranked. Enough to find a rival behind any siblings. */
const RANKED = 8

/** Tile indices of the ring, in the order the table stores them. */
const RING: number[] = []
for (let y = 0; y < FRAME_PRINT.h; y++) {
  for (let x = 0; x < FRAME_PRINT.w; x++) {
    if (x < FRAME_PRINT.ringX || x >= FRAME_PRINT.w - FRAME_PRINT.ringX
      || y < FRAME_PRINT.ringY || y >= FRAME_PRINT.h - FRAME_PRINT.ringY) {
      RING.push(y * FRAME_PRINT.w + x)
    }
  }
}
export const RING_LEN = RING.length

let parsedRows: FrameRow[] | undefined

function rows(): FrameRow[] {
  parsedRows ??= FRAME_DATA.trim().split('\n').map((line) => {
    const [id, top, bottom, score] = line.split('|') as [string, string, string, string]
    return { id, top: top.split(',').map(Number), bottom: bottom.split(',').map(Number), score: Number(score) }
  })
  return parsedRows
}

/**
 * Read the library off the decoded sprite.
 * `pixels` is RGBA, as a canvas or a PNG decoder hands it back; the sprite is
 * greyscale so only the first channel is read. Row i is frame i's ring, row
 * N + i its weights.
 */
export function parseTable(pixels: Uint8ClampedArray, width: number, height: number): FrameTable {
  const frames = rows()
  if (width !== RING_LEN || height < frames.length * 2) {
    throw new Error(`frame sprite is ${width}x${height}, expected ${RING_LEN}x${frames.length * 2}`)
  }

  const prints = new Uint8Array(frames.length * RING_LEN)
  const weights = new Uint8Array(frames.length * RING_LEN)
  for (let i = 0; i < frames.length; i++) {
    for (let k = 0; k < RING_LEN; k++) {
      prints[i * RING_LEN + k] = pixels[(i * width + k) * 4]!
      weights[i * RING_LEN + k] = pixels[((frames.length + i) * width + k) * 4]!
    }
  }
  return { frames, prints, weights }
}

/** The same library without some frames. For checking what an unknown frame does. */
export function dropFrames(table: FrameTable, drop: (frame: FrameRow) => boolean): FrameTable {
  const keep = table.frames.map((f, i) => (drop(f) ? -1 : i)).filter(i => i >= 0)
  const prints = new Uint8Array(keep.length * RING_LEN)
  const weights = new Uint8Array(keep.length * RING_LEN)
  for (const [n, i] of keep.entries()) {
    prints.set(table.prints.subarray(i * RING_LEN, (i + 1) * RING_LEN), n * RING_LEN)
    weights.set(table.weights.subarray(i * RING_LEN, (i + 1) * RING_LEN), n * RING_LEN)
  }
  return { frames: keep.map(i => table.frames[i]!), prints, weights }
}

/**
 * A card's own ring, from its pixels at any size.
 * The frame rect is shrunk to the tile size by averaging, the same way the
 * templates were, then lightness is taken per cell.
 */
export function cardPrint(pixels: Uint8ClampedArray, width: number, height: number): Float32Array {
  const { w, h } = FRAME_PRINT
  const x0 = Math.round(FRAME_INSET.x * width)
  const y0 = Math.round(FRAME_INSET.y * height)
  const bw = Math.round(FRAME_INSET.w * width)
  const bh = Math.round(FRAME_INSET.h * height)

  const out = new Float32Array(RING_LEN)
  for (const [k, idx] of RING.entries()) {
    const tx = idx % w
    const ty = Math.floor(idx / w)
    const ax = x0 + Math.floor(tx * bw / w)
    const bx = x0 + Math.max(Math.floor(tx * bw / w) + 1, Math.floor((tx + 1) * bw / w))
    const ay = y0 + Math.floor(ty * bh / h)
    const by = y0 + Math.max(Math.floor(ty * bh / h) + 1, Math.floor((ty + 1) * bh / h))

    let total = 0
    let n = 0
    for (let y = ay; y < by; y++) {
      for (let x = ax; x < bx; x++) {
        if (x < 0 || y < 0 || x >= width || y >= height) continue
        const i = (y * width + x) * 4
        const r = pixels[i]!
        const g = pixels[i + 1]!
        const b = pixels[i + 2]!
        total += (Math.max(r, g, b) + Math.min(r, g, b)) / 2
        n++
      }
    }
    out[k] = n ? total / n : 0
  }
  return out
}

/** Weighted correlation between a card's ring and one frame's. */
function correlation(print: Float32Array, table: FrameTable, frame: number): number {
  const base = frame * RING_LEN
  let n = 0
  let sumCard = 0
  let sumFrame = 0
  for (let k = 0; k < RING_LEN; k++) {
    const wt = table.weights[base + k]!
    if (!wt) continue
    n += wt
    sumCard += wt * print[k]!
    sumFrame += wt * table.prints[base + k]!
  }
  if (n < RING_LEN * 255 * MIN_WEIGHT) return -1

  const meanCard = sumCard / n
  const meanFrame = sumFrame / n
  let cov = 0
  let varCard = 0
  let varFrame = 0
  for (let k = 0; k < RING_LEN; k++) {
    const wt = table.weights[base + k]!
    if (!wt) continue
    const dc = print[k]! - meanCard
    const df = table.prints[base + k]! - meanFrame
    cov += wt * dc * df
    varCard += wt * dc * dc
    varFrame += wt * df * df
  }
  return cov / Math.sqrt(varCard * varFrame + 1e-9)
}

/** A plate, given in thousandths of the frame, placed into card space. */
function toCardSpace(plate: number[], inset: FrameMatch['inset']): Rect {
  const [x, y, w, h] = plate as [number, number, number, number]
  return {
    x: (inset.x + (x / 1000) * inset.w) * CARD.w,
    y: (inset.y + (y / 1000) * inset.h) * CARD.h,
    w: ((w / 1000) * inset.w) * CARD.w,
    h: ((h / 1000) * inset.h) * CARD.h,
  }
}

function build(frame: FrameRow, score: number): FrameMatch {
  return {
    id: frame.id,
    score: Math.round(score * 1000) / 1000,
    inset: FRAME_INSET,
    confidence: frame.score,
    maskUrl: `/card-frame-masks/${frame.id}.png`,
    redactions: [toCardSpace(frame.top, FRAME_INSET), toCardSpace(frame.bottom, FRAME_INSET)],
  }
}

/**
 * The closest frames to a card's ring, best first, with no threshold applied.
 * Pure, so it runs under Node against real card images; exported so the
 * accept thresholds can be calibrated against real numbers rather than guessed.
 */
export function rankPrint(print: Float32Array, table: FrameTable, count = RANKED): FrameMatch[] {
  const scored = table.frames.map((frame, i) => ({ frame, score: correlation(print, table, i) }))
  return scored.sort((a, b) => b.score - a.score).slice(0, count)
    .map(r => build(r.frame, r.score))
}

function samePlates(a: FrameMatch, b: FrameMatch): boolean {
  return a.redactions.every((r, i) => {
    const o = b.redactions[i]!
    return Math.abs(r.x - o.x) <= PLATE_TOLERANCE && Math.abs(r.y - o.y) <= PLATE_TOLERANCE
      && Math.abs(r.w - o.w) <= PLATE_TOLERANCE && Math.abs(r.h - o.h) <= PLATE_TOLERANCE
  })
}

/** Apply the accept rule to a ranking. */
export function acceptMatch(ranked: FrameMatch[]): FrameMatch | undefined {
  const best = ranked[0]
  if (!best || best.score < ACCEPT_MIN) return undefined
  // The runner-up only counts if believing it instead would move the mask.
  const rival = ranked.slice(1).find(r => !samePlates(r, best))
  if (rival && best.score - rival.score < ACCEPT_MARGIN) return undefined
  return best
}

let pending: Promise<FrameTable> | undefined

/**
 * Fetch and decode the sprite, once per session.
 * A failed fetch is forgotten, so the next card tries again rather than
 * every card after a blip being scanned instead.
 */
export function loadFrameTable(): Promise<FrameTable> {
  pending ??= (async () => {
    try {
      const img = await loadImage(publicUrl(FRAME_PRINT.url))
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) throw new Error('no 2d context')
      ctx.drawImage(img, 0, 0)
      return parseTable(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height)
    }
    catch (error) {
      pending = undefined
      throw error
    }
  })()
  return pending
}

/**
 * Find the frame a card uses.
 * Returns nothing when the card's border matches no frame in the library,
 * which is the signal to fall back to scanning for the bars instead.
 */
export async function matchFrame(img: CanvasImageSource): Promise<FrameMatch | undefined> {
  const table = await loadFrameTable()

  const canvas = document.createElement('canvas')
  canvas.width = CARD.w
  canvas.height = CARD.h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return undefined

  // A card is a PNG with a transparent margin. Over white, that margin reads
  // as light rather than as the black a bare canvas would give it.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, CARD.w, CARD.h)
  ctx.drawImage(img, 0, 0, CARD.w, CARD.h)

  const print = cardPrint(ctx.getImageData(0, 0, CARD.w, CARD.h).data, CARD.w, CARD.h)
  return acceptMatch(rankPrint(print, table))
}

/** Typical plate proportions, used to shape a box when the text is read instead. */
export const PLATE_SHAPE = { width: 0.283, height: 0.032 }
