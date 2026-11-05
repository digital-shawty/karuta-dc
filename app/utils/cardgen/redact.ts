// The black boxes that hide a card's code and its print numbers.
//
// Boxes live in card space, a fixed 274 x 405 grid laid over whatever the
// image actually measures, so the same numbers work for an off-size card.
//
// Placement goes through three stages, each a fallback for the one before:
//
//   1. recognise the frame, and use the plate positions recorded for it
//   2. scan for the dark bars, which is instant and usually close
//   3. read the text, for a frame the library has never seen
//
// The first two finish before the card is shown, so a card is never on
// screen, and never exportable, with its code showing. Recognising the frame
// waits on a one-off fetch of the frame library the first time. Reading the
// text happens afterwards and quietly tightens the boxes if it finds something
// better.

import { detectOnImage } from './detect'
import { matchFrame } from './frames'
import { CARD, type CardImage, type DetectSource, type ImageAsset, type Rect } from './types'

/**
 * Where the plates usually sit, for a card that matched nothing.
 * Deliberately generous: over-covering costs nothing, while under-covering
 * leaks the code the tool exists to hide.
 */
export function defaultRedactions(): Rect[] {
  return [
    { x: 70, y: 6, w: 134, h: 30 },
    { x: 78, y: 362, w: 118, h: 30 },
  ]
}

/** Keep a found box, fall back to the default for whichever pill was missed. */
export function fromDetection(found: { top?: Rect, bottom?: Rect }): {
  redactions: Rect[]
  detect: DetectSource
} {
  const [topDefault, bottomDefault] = defaultRedactions() as [Rect, Rect]
  const hit = Boolean(found.top || found.bottom)
  return {
    redactions: [found.top ?? topDefault, found.bottom ?? bottomDefault],
    detect: hit ? 'pixel' : 'fallback',
  }
}

/**
 * Promote an image to a card, covering its code straight away.
 * Never throws: a card with crude boxes beats a card with none.
 */
export async function toCardImage(asset: ImageAsset, img?: CanvasImageSource): Promise<CardImage> {
  if (!img) return { ...asset, redactions: defaultRedactions(), detect: 'fallback' }

  try {
    const frame = await matchFrame(img)
    if (frame) {
      return {
        ...asset,
        redactions: frame.redactions,
        mask: { url: frame.maskUrl, inset: frame.inset },
        detect: 'frame',
        frame: frame.id,
      }
    }
  }
  catch (error) {
    console.warn('cc-gen: frame matching failed, scanning instead', error)
  }

  try {
    return { ...asset, ...fromDetection(detectOnImage(img)) }
  }
  catch {
    return { ...asset, redactions: defaultRedactions(), detect: 'fallback' }
  }
}

/** Boxes placed by anything weaker than a frame match are worth a second try. */
export function wantsOcr(card: CardImage): boolean {
  return card.detect === 'pixel' || card.detect === 'fallback'
}

/**
 * Read the card's text and tighten its boxes.
 * Returns nothing when there is no improvement to make, so the caller can
 * leave the card alone rather than churning it.
 */
export async function refineByReading(card: CardImage, img: CanvasImageSource): Promise<CardImage | undefined> {
  if (!wantsOcr(card)) return undefined

  try {
    const { readPlates } = await import('./ocr')
    const found = await readPlates(img)
    if (!found.top && !found.bottom) return undefined

    const [top, bottom] = card.redactions as [Rect, Rect]
    return {
      ...card,
      redactions: [found.top ?? top, found.bottom ?? bottom],
      detect: 'ocr',
    }
    // No mask here: reading the text gives a position, not an outline.
  }
  catch (error) {
    console.warn('cc-gen: could not read the card text', error)
    return undefined
  }
}

/** Clamp a box to the card, keeping it big enough to grab hold of. */
export function clampRect(r: Rect): Rect {
  const w = Math.max(8, Math.min(r.w, CARD.w))
  const h = Math.max(8, Math.min(r.h, CARD.h))
  return {
    w,
    h,
    x: Math.max(0, Math.min(r.x, CARD.w - w)),
    y: Math.max(0, Math.min(r.y, CARD.h - h)),
  }
}
