// Reading a card's code when its frame is not in the library.
//
// This is the fallback behind frames.ts, and it should be rare: almost every
// card uses a known frame, where the plate position is already recorded. A
// brand new frame has no entry, so the text itself is found instead.
//
// Tesseract is six megabytes or so, which would be a silly thing to make
// everyone download for a path most cards never take, so it is pulled in on
// first use and kept for the rest of the session.
//
// The box that comes back is shaped like a real plate rather than hugging the
// letters, so a card masked this way sits alongside the others without
// looking like the odd one out.

import { PLATE_SHAPE } from './frames'
import { CARD, type Rect } from './types'

/** How much of the card, top and bottom, is searched for text. */
const BAND = 0.18
/** Text is small; recognising it goes better enlarged. */
const ZOOM = 3
/** Space left around the text, as a share of the text's own height. */
const PAD_X = 0.55
const PAD_Y = 0.42

const CODE = /^[A-Z0-9]{5,9}$/
const NUMBERS = /^\d{1,6}\s*[·.\-]\s*\d{1,4}$/

type Worker = { recognize: (image: unknown, options?: unknown) => Promise<{
  data: { words: { text: string, bbox: { x0: number, y0: number, x1: number, y1: number } }[] }
}> }

let pending: Promise<Worker> | undefined

async function worker(): Promise<Worker> {
  pending ??= (async () => {
    const tesseract = await import('tesseract.js')
    const made = await tesseract.createWorker('eng')
    await made.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·.-',
      // One line of text, which is all a plate ever holds.
      tessedit_pageseg_mode: '7' as never,
    })
    return made as unknown as Worker
  })()
  return pending
}

/** Pull one band out of the card, enlarged and flattened to help recognition. */
function band(img: CanvasImageSource, top: boolean): HTMLCanvasElement | undefined {
  const bandH = Math.round(CARD.h * BAND)
  const canvas = document.createElement('canvas')
  canvas.width = CARD.w * ZOOM
  canvas.height = bandH * ZOOM

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return undefined

  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(
    img,
    0, top ? 0 : CARD.h - bandH, CARD.w, bandH,
    0, 0, canvas.width, canvas.height,
  )

  // Plates are light text on a dark bar; inverting gives Tesseract the dark
  // text on light it expects, and the contrast stretch sharpens the edges.
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const d = frame.data
  for (let i = 0; i < d.length; i += 4) {
    const luma = 0.299 * d[i]! + 0.587 * d[i + 1]! + 0.114 * d[i + 2]!
    const value = Math.max(0, Math.min(255, (255 - luma - 110) * 2.1 + 128))
    d[i] = d[i + 1] = d[i + 2] = value
  }
  ctx.putImageData(frame, 0, 0)
  return canvas
}

/** Grow a text box into something plate-shaped, in card space. */
function asPlate(box: { x0: number, y0: number, x1: number, y1: number }, top: boolean): Rect {
  const textH = (box.y1 - box.y0) / ZOOM
  const padX = textH * PAD_X
  const padY = textH * PAD_Y

  const x = box.x0 / ZOOM - padX
  const w = (box.x1 - box.x0) / ZOOM + padX * 2
  // Never come out shorter than a real plate, or the mask looks mean next to one.
  const h = Math.max(textH + padY * 2, CARD.h * PLATE_SHAPE.height)
  const centre = (box.y0 + box.y1) / 2 / ZOOM + (top ? 0 : CARD.h - CARD.h * BAND)

  return {
    x: Math.max(0, Math.min(x, CARD.w)),
    y: Math.max(0, Math.min(centre - h / 2, CARD.h - h)),
    w: Math.min(w, CARD.w),
    h,
  }
}

/**
 * Find the code and the edition numbers by reading them.
 * Either may come back missing, in which case the caller keeps whatever box
 * it already had for that end of the card.
 */
export async function readPlates(img: CanvasImageSource): Promise<{ top?: Rect, bottom?: Rect }> {
  const out: { top?: Rect, bottom?: Rect } = {}
  const engine = await worker()

  for (const top of [true, false]) {
    const canvas = band(img, top)
    if (!canvas) continue

    const { data } = await engine.recognize(canvas)
    const wanted = top ? CODE : NUMBERS

    let hit = data.words.find(word => wanted.test(word.text.trim().toUpperCase()))
    // The separator sometimes splits the numbers in two; stitch them back.
    if (!hit && !top) {
      const digits = data.words.filter(w => /^\d+$/.test(w.text.trim()))
      if (digits.length >= 2) {
        const [a, b] = digits as [typeof digits[0], typeof digits[0]]
        hit = {
          text: `${a.text}.${b.text}`,
          bbox: {
            x0: Math.min(a.bbox.x0, b.bbox.x0),
            y0: Math.min(a.bbox.y0, b.bbox.y0),
            x1: Math.max(a.bbox.x1, b.bbox.x1),
            y1: Math.max(a.bbox.y1, b.bbox.y1),
          },
        }
      }
    }

    if (hit) out[top ? 'top' : 'bottom'] = asPlate(hit.bbox, top)
  }

  return out
}
