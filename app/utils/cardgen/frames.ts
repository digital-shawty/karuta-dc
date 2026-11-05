// Recognising which frame a card uses, so its code can be masked exactly.
//
// Every card the bot makes sits in one of a few hundred frames, and each frame
// prints the code and the edition numbers onto solid bars at fixed positions.
// Those bars move a long way between frames: the code bar's centre runs from a
// seventh to seven eighths of the way across. No single default box can cover
// that, so the frame is identified and its own plates are used.
//
// What makes this work on a real card rather than a bare template:
//
//   the ring    only the border is compared, and only the cells of it that are
//               wholly frame on the template, a cell in from the panel. The
//               panel holds character art on a real card, and art had been
//               the undoing of this: a frame whose border is a light bar on a
//               dark margin reads like any card whose art is light right up
//               to its frame. So the panel is kept well clear, including the
//               tinted and speckled panels many frames have.
//
//   lightness   the bot dyes every frame to the card's theme, so a card's
//               colours say nothing about its frame. Celestial is blue and
//               gold as a template and solid green on a card. The pattern of
//               light and dark in the border survives the dye, so lightness
//               is what is compared, by correlation so a dye that darkens or
//               brightens the whole frame does not matter.
//
//   relief      half the score is the border's fine structure: each cell less
//               the cells around it, which is where the thorns, petals and
//               rivets are. Light against dark is easy to match by accident;
//               a hundred small edges in the right places are not.
//
//   the inset   every card the bot makes is the same shape: the frame sits ten
//               pixels in from each edge of a 274 x 405 image, with a glow in
//               the margin. The ring is read there, then a pixel either way
//               for the leading candidates, because relief is only worth
//               anything when it lines up. A card with that margin cropped off
//               is tried too, as a frame filling its whole picture.
//
//   the plates  a frame that would put a dark plate on light pixels of the
//               card, or a pale one on dark, is not the frame, however well
//               its border happened to score.

import { FRAME_DATA, FRAME_PRINT } from './frame-data'
import { loadImage, publicUrl } from './images'
import { CARD, type Rect } from './types'

export interface FrameMatch {
  id: string
  /** Agreement with the frame's border, 1 is identical. Higher is better. */
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
  /** Whether each plate is pale with dark text, rather than dark with light. */
  pale: [boolean, boolean]
  score: number
}

/** The library, as read off the sprite. Frame i's ring is at i * RING_LEN. */
export interface FrameTable {
  frames: FrameRow[]
  /** Lightness of each frame's ring, 0 to 255. */
  prints: Uint8Array
  /** How much of each ring cell is frame on the template, 0 to 255. */
  coverage: Uint8Array
  /**
   * 255 where a ring cell is compared, else 0: the cells wholly frame on the
   * template with every neighbour wholly frame too. See `solidCells`.
   */
  weights: Uint8Array
  /** Each frame's ring as relief: lightness less the mean of the cells around. */
  relief: Float32Array
}

type Inset = FrameMatch['inset']

/**
 * Where the frame sits on a card the bot made.
 * Measured on real cards: a 254 x 380 frame centred on a 274 x 405 image, the
 * ten pixel margin holding the glow. Every card checked sat within a pixel.
 */
export const FRAME_INSET: Inset = {
  x: 10 / CARD.w,
  y: 10 / CARD.h,
  w: 254 / CARD.w,
  h: 380 / CARD.h,
}

/** A picture that is nothing but the frame, its glow margin cut off. */
const WHOLE_PICTURE: Inset = { x: 0, y: 0, w: 1, h: 1 }

/**
 * Whether a match is believed.
 *
 * Measured on ten real cards against the whole library, each as uploaded,
 * with light art painted over its panel, and nudged up to two pixels. The
 * right frame came first every time, scoring 0.59 to 0.93 and leading the
 * nearest frame with different plates by 0.17 or more. With the right frame
 * removed from the library, the best answer that would have moved the mask
 * scored no more than 0.57, and the few that led by a margin scored under
 * 0.50. Both thresholds have to pass.
 *
 * A wrong frame would put the mask somewhere else entirely and leave the code
 * on display, so the thresholds err towards turning a card away. A card
 * turned away falls back to scanning for its bars, which still covers them.
 */
const ACCEPT_MIN = 0.50
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
/** How many of the leading frames are re-read a pixel either way. */
const REFINED = 16
/**
 * A frame whose solid cells would cover less of the ring than this keeps its
 * whole cells uneroded instead: a border a cell wide has nothing left after
 * erosion, and a frame with nothing to compare on cannot be recognised at all.
 */
const MIN_SOLID = 1 / 12
/**
 * What the card must read inside a plate, as mean luma. The plates are solid
 * with a line of text: on ten real cards a dark plate read 16 to 76.
 */
const PLATE_DARK = 110
const PLATE_PALE = 150

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

/**
 * Each ring cell's neighbours within the ring, as ring indices, up to four.
 * Only the cells it shares an edge with: the weights keep a cell that is
 * compared away from the panel in exactly those four directions, so the
 * relief of a frame cell never takes in the art, while a diagonal might.
 */
const NEIGHBOURS = new Int32Array(RING_LEN * 4).fill(-1)
{
  const ringIndex = new Map(RING.map((tile, k) => [tile, k]))
  for (const [k, tile] of RING.entries()) {
    const x = tile % FRAME_PRINT.w
    const y = Math.floor(tile / FRAME_PRINT.w)
    let n = 0
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nx = x + dx!
      const ny = y + dy!
      if (nx < 0 || ny < 0 || nx >= FRAME_PRINT.w || ny >= FRAME_PRINT.h) continue
      const j = ringIndex.get(ny * FRAME_PRINT.w + nx)
      if (j !== undefined) NEIGHBOURS[k * 4 + n++] = j
    }
  }
}

let parsedRows: FrameRow[] | undefined

function rows(): FrameRow[] {
  parsedRows ??= FRAME_DATA.trim().split('\n').map((line) => {
    const [id, top, bottom, score] = line.split('|') as [string, string, string, string]
    const t = top.split(',').map(Number)
    const b = bottom.split(',').map(Number)
    return { id, top: t.slice(0, 4), bottom: b.slice(0, 4), pale: [t[4] === 1, b[4] === 1], score: Number(score) }
  })
  return parsedRows
}

/**
 * A ring's relief: each cell less the mean of itself and the cells beside
 * it. Keeps the thorns and loses the dye.
 */
export function relief(print: ArrayLike<number>, at = 0): Float32Array {
  const out = new Float32Array(RING_LEN)
  for (let k = 0; k < RING_LEN; k++) {
    let sum = print[at + k]!
    let n = 1
    for (let i = k * 4; i < k * 4 + 4 && NEIGHBOURS[i]! >= 0; i++) {
      sum += print[at + NEIGHBOURS[i]!]!
      n++
    }
    out[k] = print[at + k]! - sum / n
  }
  return out
}

/**
 * Read the library off the decoded sprite.
 * `pixels` is RGBA, as a canvas or a PNG decoder hands it back; the sprite is
 * greyscale so only the first channel is read. Row i is frame i's ring, row
 * N + i its weights. The relief is worked out here, once.
 */
export function parseTable(pixels: Uint8ClampedArray, width: number, height: number): FrameTable {
  const frames = rows()
  if (width !== RING_LEN || height < frames.length * 2) {
    throw new Error(`frame sprite is ${width}x${height}, expected ${RING_LEN}x${frames.length * 2}`)
  }

  const prints = new Uint8Array(frames.length * RING_LEN)
  const coverage = new Uint8Array(frames.length * RING_LEN)
  const weights = new Uint8Array(frames.length * RING_LEN)
  for (let i = 0; i < frames.length; i++) {
    for (let k = 0; k < RING_LEN; k++) {
      prints[i * RING_LEN + k] = pixels[(i * width + k) * 4]!
      coverage[i * RING_LEN + k] = pixels[((frames.length + i) * width + k) * 4]!
    }
    weights.set(solidCells(coverage.subarray(i * RING_LEN, (i + 1) * RING_LEN)), i * RING_LEN)
  }
  const reliefs = new Float32Array(frames.length * RING_LEN)
  for (let i = 0; i < frames.length; i++) reliefs.set(relief(prints, i * RING_LEN), i * RING_LEN)
  return { frames, prints, coverage, weights, relief: reliefs }
}

/**
 * Which cells of a ring to compare, from the share of each that is frame.
 *
 * Only cells wholly frame, and only those with every edge-neighbour wholly
 * frame too. A cell that is part panel averages art into its lightness on a
 * real card, and so does a whole cell beside the panel once the frame is a
 * pixel or two off; worse, the relief of a cell beside the panel is taken
 * against the art. Erosion keeps the cells compared, and their neighbours,
 * a cell clear of all that.
 */
export function solidCells(share: Uint8Array): Uint8Array {
  const whole = share.map(v => (v >= 255 ? 255 : 0))
  const solid = new Uint8Array(RING_LEN)
  let kept = 0
  for (let k = 0; k < RING_LEN; k++) {
    if (!whole[k]) continue
    let keep = true
    for (let i = k * 4; i < k * 4 + 4 && NEIGHBOURS[i]! >= 0; i++) {
      if (!whole[NEIGHBOURS[i]!]) { keep = false; break }
    }
    if (keep) { solid[k] = 255; kept++ }
  }
  return kept >= RING_LEN * MIN_SOLID ? solid : whole
}

/** The same library without some frames. For checking what an unknown frame does. */
export function dropFrames(table: FrameTable, drop: (frame: FrameRow) => boolean): FrameTable {
  const keep = table.frames.map((f, i) => (drop(f) ? -1 : i)).filter(i => i >= 0)
  const prints = new Uint8Array(keep.length * RING_LEN)
  const coverage = new Uint8Array(keep.length * RING_LEN)
  const weights = new Uint8Array(keep.length * RING_LEN)
  const reliefs = new Float32Array(keep.length * RING_LEN)
  for (const [n, i] of keep.entries()) {
    prints.set(table.prints.subarray(i * RING_LEN, (i + 1) * RING_LEN), n * RING_LEN)
    coverage.set(table.coverage.subarray(i * RING_LEN, (i + 1) * RING_LEN), n * RING_LEN)
    weights.set(table.weights.subarray(i * RING_LEN, (i + 1) * RING_LEN), n * RING_LEN)
    reliefs.set(table.relief.subarray(i * RING_LEN, (i + 1) * RING_LEN), n * RING_LEN)
  }
  return { frames: keep.map(i => table.frames[i]!), prints, coverage, weights, relief: reliefs }
}

/**
 * A card's own ring, from its pixels at any size, read `dx` and `dy` pixels
 * off the nominal inset.
 * The frame rect is shrunk to the tile size by averaging, the same way the
 * templates were, then lightness is taken per cell.
 */
export function cardPrint(pixels: Uint8ClampedArray, width: number, height: number, dx = 0, dy = 0): Float32Array {
  const { w, h } = FRAME_PRINT
  const x0 = Math.round(FRAME_INSET.x * width) + dx
  const y0 = Math.round(FRAME_INSET.y * height) + dy
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

/** Weighted correlation between a card's ring and one frame's, over the frame's cells. */
function correlation(
  card: ArrayLike<number>,
  frame: ArrayLike<number>,
  at: number,
  weights: Uint8Array,
): number {
  let n = 0
  let sumCard = 0
  let sumFrame = 0
  for (let k = 0; k < RING_LEN; k++) {
    const wt = weights[at + k]!
    if (!wt) continue
    n += wt
    sumCard += wt * card[k]!
    sumFrame += wt * frame[at + k]!
  }
  if (n < RING_LEN * 255 * MIN_WEIGHT) return -1

  const meanCard = sumCard / n
  const meanFrame = sumFrame / n
  let cov = 0
  let varCard = 0
  let varFrame = 0
  for (let k = 0; k < RING_LEN; k++) {
    const wt = weights[at + k]!
    if (!wt) continue
    const dc = card[k]! - meanCard
    const df = frame[at + k]! - meanFrame
    cov += wt * dc * df
    varCard += wt * dc * dc
    varFrame += wt * df * df
  }
  return cov / Math.sqrt(varCard * varFrame + 1e-9)
}

/** How well a card's ring agrees with one frame: half lightness, half relief. */
function agreement(print: Float32Array, cardRelief: Float32Array, table: FrameTable, frame: number): number {
  const at = frame * RING_LEN
  const tone = correlation(print, table.prints, at, table.weights)
  if (tone === -1) return -1
  return (tone + correlation(cardRelief, table.relief, at, table.weights)) / 2
}

/** A plate, given in thousandths of the frame, placed into card space. */
function toCardSpace(plate: number[], inset: Inset): Rect {
  const [x, y, w, h] = plate as [number, number, number, number]
  return {
    x: (inset.x + (x / 1000) * inset.w) * CARD.w,
    y: (inset.y + (y / 1000) * inset.h) * CARD.h,
    w: ((w / 1000) * inset.w) * CARD.w,
    h: ((h / 1000) * inset.h) * CARD.h,
  }
}

function build(frame: FrameRow, score: number, inset: Inset = FRAME_INSET): FrameMatch {
  return {
    id: frame.id,
    score: Math.round(score * 1000) / 1000,
    inset,
    confidence: frame.score,
    maskUrl: `/card-frame-masks/${frame.id}.png`,
    redactions: [toCardSpace(frame.top, inset), toCardSpace(frame.bottom, inset)],
  }
}

/**
 * The closest frames to a card's ring, best first, with no threshold applied.
 * Pure, so it runs under Node against real card images; exported so the
 * accept thresholds can be calibrated against real numbers rather than guessed.
 */
export function rankPrint(print: Float32Array, table: FrameTable, count = RANKED): FrameMatch[] {
  const cardRelief = relief(print)
  const scored = table.frames.map((frame, i) => ({ frame, score: agreement(print, cardRelief, table, i) }))
  return scored.sort((a, b) => b.score - a.score).slice(0, count)
    .map(r => build(r.frame, r.score))
}

/**
 * The leading frames scored again with the ring read a pixel off in each
 * direction, each keeping its best. Real cards sit within a pixel of the
 * nominal inset, and relief only lines up when the reading does.
 */
function refineRank(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  table: FrameTable,
  ranked: FrameMatch[],
): FrameMatch[] {
  const index = new Map(table.frames.map((f, i) => [f.id, i]))
  const best = new Map(ranked.map(m => [m.id, m]))
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue
      const print = cardPrint(pixels, width, height, dx, dy)
      const cardRelief = relief(print)
      for (const [id, held] of best) {
        const i = index.get(id)!
        const score = agreement(print, cardRelief, table, i)
        if (score > held.score) best.set(id, build(table.frames[i]!, score))
      }
    }
  }
  return [...best.values()].sort((a, b) => b.score - a.score)
}

/** Mean luma of the card over the middle of a plate, in the pixels' own space. */
function plateLuma(pixels: Uint8ClampedArray, width: number, height: number, plate: Rect): number {
  const sx = width / CARD.w
  const sy = height / CARD.h
  const x0 = Math.round((plate.x + plate.w * 0.15) * sx)
  const x1 = Math.round((plate.x + plate.w * 0.85) * sx)
  const y0 = Math.round((plate.y + plate.h * 0.2) * sy)
  const y1 = Math.round((plate.y + plate.h * 0.8) * sy)
  let total = 0
  let n = 0
  for (let y = Math.max(0, y0); y < Math.min(height, y1); y++) {
    for (let x = Math.max(0, x0); x < Math.min(width, x1); x++) {
      const i = (y * width + x) * 4
      total += 0.299 * pixels[i]! + 0.587 * pixels[i + 1]! + 0.114 * pixels[i + 2]!
      n++
    }
  }
  return n ? total / n : 255
}

/** Whether the card is the right tone where this frame says its plates are. */
export function platesFit(pixels: Uint8ClampedArray, width: number, height: number, match: FrameMatch, table: FrameTable): boolean {
  const frame = table.frames.find(f => f.id === match.id)
  if (!frame) return false
  return match.redactions.every((plate, i) => {
    const luma = plateLuma(pixels, width, height, plate)
    return frame.pale[i] ? luma > PLATE_PALE : luma < PLATE_DARK
  })
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

/**
 * The whole procedure on a card already drawn at CARD size with its frame at
 * FRAME_INSET. `inset` is where the frame sits in the picture that was
 * uploaded, which is what the mask and the boxes are reported against.
 */
export function findFrame(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  table: FrameTable,
  inset: Inset = FRAME_INSET,
): FrameMatch | undefined {
  const match = acceptMatch(rankCard(pixels, width, height, table))
  if (!match || inset === FRAME_INSET) return match
  return build(table.frames.find(f => f.id === match.id)!, match.score, inset)
}

/**
 * The leading frames for a card, best first: ranked, the leaders refined,
 * and any whose plates do not fit the card dropped. What the accept rule is
 * applied to, and what the checks measure margins on.
 */
export function rankCard(pixels: Uint8ClampedArray, width: number, height: number, table: FrameTable): FrameMatch[] {
  const leaders = rankPrint(cardPrint(pixels, width, height), table, REFINED)
  return refineRank(pixels, width, height, table, leaders)
    .filter(m => platesFit(pixels, width, height, m, table))
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
 *
 * The picture is tried twice: as a card the bot made, and as a bare frame
 * with its glow margin cropped off, drawn into the inset so the ring lands on
 * it. Whichever reading is believed with the better score wins.
 */
export async function matchFrame(img: CanvasImageSource): Promise<FrameMatch | undefined> {
  const table = await loadFrameTable()

  const canvas = document.createElement('canvas')
  canvas.width = CARD.w
  canvas.height = CARD.h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return undefined

  let found: FrameMatch | undefined
  for (const inset of [FRAME_INSET, WHOLE_PICTURE]) {
    // A card is a PNG with a transparent margin. Over white, that margin reads
    // as light rather than as the black a bare canvas would give it.
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, CARD.w, CARD.h)
    if (inset === FRAME_INSET) {
      ctx.drawImage(img, 0, 0, CARD.w, CARD.h)
    }
    else {
      ctx.drawImage(img, FRAME_INSET.x * CARD.w, FRAME_INSET.y * CARD.h, FRAME_INSET.w * CARD.w, FRAME_INSET.h * CARD.h)
    }
    const pixels = ctx.getImageData(0, 0, CARD.w, CARD.h).data
    const match = findFrame(pixels, CARD.w, CARD.h, table, inset)
    if (match && (!found || match.score > found.score)) found = match
  }
  return found
}

/** Typical plate proportions, used to shape a box when the text is read instead. */
export const PLATE_SHAPE = { width: 0.283, height: 0.032 }
