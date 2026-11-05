// Finding the two dark pills on a card: the code at the top, the edition and
// print numbers at the bottom.
//
// No OCR. Both pills are solid dark bars with light text on them, sitting on
// much brighter art, so a pixel scan finds them in a couple of milliseconds
// with nothing to download. Each row near the top or bottom edge is searched
// for a dark run about as wide as a plate, allowing for the light glyphs that
// break it, and consecutive rows whose runs line up are stacked into a box.
// The box that looks most like a plate wins.
//
// A run that spans most of the card is a frame border, not a plate, and is
// ignored. That is what counting dark pixels per row got wrong: a card with a
// dark border read as one enormous pill.
//
// A miss is not a failure. The caller keeps the default boxes, which already
// cover the usual position, and the card can still be nudged by hand.

import { CARD, type Rect } from './types'

/** How far in from each edge to look, as a share of card height. */
const BAND = 0.16
/** Below this luma a pixel counts as part of a pill. */
const DARK = 50
/** Light pixels inside a run up to this long are text on the plate, not its edge. */
const GAP = 4
/** A plate is between these shares of the card's width. */
const MIN_W = 0.14
const MAX_W = 0.55
/** What a plate usually measures, as shares of the card. */
const IDEAL_W = 0.285
const IDEAL_H = 0.032
/** Where a plate's top edge usually sits, as a share of the card's height. */
const IDEAL_TOP = 0.06
const IDEAL_BOTTOM = 0.90
/** A pill is at least this many rows tall. */
const MIN_RUN = 6
/** Breathing room added around the found box. */
const PAD = 4

interface Run { start: number, end: number }
interface Box { x0: number, x1: number, y0: number, y1: number }

function luma(d: Uint8ClampedArray, i: number): number {
  return 0.299 * d[i]! + 0.587 * d[i + 1]! + 0.114 * d[i + 2]!
}

/** Plate-width dark runs across one row, with short light gaps closed. */
function runsIn(data: Uint8ClampedArray, w: number, y: number): Run[] {
  const runs: Run[] = []
  let start = -1
  let lastDark = -1
  for (let x = 0; x < w; x++) {
    if (luma(data, (y * w + x) * 4) < DARK) {
      if (start < 0) start = x
      lastDark = x
    }
    else if (start >= 0 && x - lastDark > GAP) {
      runs.push({ start, end: lastDark + 1 })
      start = -1
    }
  }
  if (start >= 0) runs.push({ start, end: lastDark + 1 })
  return runs.filter(r => r.end - r.start >= w * MIN_W && r.end - r.start <= w * MAX_W)
}

/** Scan one horizontal band for the most plate-like stack of dark runs. */
function scanBand(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  from: number,
  to: number,
): Rect | undefined {
  let live: Box[] = []
  const done: Box[] = []
  for (let y = from; y < to; y++) {
    const next: Box[] = []
    for (const r of runsIn(data, w, y)) {
      const hit = live.find(b => !next.includes(b) && r.start < b.x1 && r.end > b.x0)
      if (hit) {
        hit.x0 = Math.min(hit.x0, r.start)
        hit.x1 = Math.max(hit.x1, r.end)
        hit.y1 = y + 1
        next.push(hit)
      }
      else {
        next.push({ x0: r.start, x1: r.end, y0: y, y1: y + 1 })
      }
    }
    for (const b of live) if (!next.includes(b)) done.push(b)
    live = next
  }
  done.push(...live)

  let best: { score: number, box: Box } | undefined
  for (const box of done) {
    const bw = box.x1 - box.x0
    const bh = box.y1 - box.y0
    if (bh < MIN_RUN || bw > w * MAX_W) continue
    const aspect = bw / bh
    if (aspect < 2.2 || aspect > 15) continue
    // Shape first, then how far it sits from where plates usually are: art
    // under the name can throw a plate-shaped shadow, but not at the edge.
    const score = Math.abs(bw / w - IDEAL_W) / IDEAL_W
      + Math.abs(bh / h - IDEAL_H) / IDEAL_H / 2
      + Math.abs(box.y0 / h - (from === 0 ? IDEAL_TOP : IDEAL_BOTTOM)) * 6
    if (!best || score < best.score) best = { score, box }
  }
  if (!best) return undefined

  const { box } = best
  return {
    x: box.x0 - PAD,
    y: box.y0 - PAD,
    w: box.x1 - box.x0 + PAD * 2,
    h: box.y1 - box.y0 + PAD * 2,
  }
}

function clamp(r: Rect, w: number, h: number): Rect {
  const x = Math.max(0, Math.min(r.x, w))
  const y = Math.max(0, Math.min(r.y, h))
  return { x, y, w: Math.min(r.w, w - x), h: Math.min(r.h, h - y) }
}

/**
 * Locate both pills on a card already normalised to CARD dimensions.
 * Pure, so it can be exercised on synthetic pixels without a browser.
 */
export function detectPills(
  data: Uint8ClampedArray,
  w = CARD.w,
  h = CARD.h,
): { top?: Rect, bottom?: Rect } {
  const band = Math.round(h * BAND)
  const top = scanBand(data, w, h, 0, band)
  const bottom = scanBand(data, w, h, h - band, h)
  return {
    top: top && clamp(top, w, h),
    bottom: bottom && clamp(bottom, w, h),
  }
}

/**
 * Run the scan over a decoded card image.
 * The card is drawn into a CARD-sized buffer first, so the boxes that come
 * back are already in card space and an off-size card needs no extra maths.
 */
export function detectOnImage(img: CanvasImageSource): { top?: Rect, bottom?: Rect } {
  const canvas = document.createElement('canvas')
  canvas.width = CARD.w
  canvas.height = CARD.h

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return {}

  // A card is a PNG with a transparent margin around its frame. On a bare
  // canvas that margin reads as black, and the scan would box the margin
  // instead of the plates. Over white it reads as light and is ignored.
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, CARD.w, CARD.h)
  ctx.drawImage(img, 0, 0, CARD.w, CARD.h)
  return detectPills(ctx.getImageData(0, 0, CARD.w, CARD.h).data)
}
