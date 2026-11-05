// The one place a matchup is drawn.
//
// The live preview, the gallery thumbnails and the exported file all come
// through here, so what you see on screen cannot drift from what you download.
// Everything is in canvas space; the preview only ever scales the canvas
// element with CSS.

import { loadImage } from './images'
import { markImage, markWidth } from './marks'
import { CARD, type CardImage, type Rect, type Scene } from './types'

export interface RenderOptions {
  /** Draw empty slots as outlines. On for the preview, off for a download. */
  placeholders?: boolean
}

type Ctx = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

/** Fit a picture inside a box without cropping it. */
function containFit(iw: number, ih: number, box: Rect): Rect {
  const scale = Math.min(box.w / iw, box.h / ih)
  const w = iw * scale
  const h = ih * scale
  return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h }
}

function roundedPath(ctx: Ctx, r: Rect, radius: number): void {
  const rad = Math.min(radius, r.w / 2, r.h / 2)
  ctx.beginPath()
  ctx.moveTo(r.x + rad, r.y)
  ctx.arcTo(r.x + r.w, r.y, r.x + r.w, r.y + r.h, rad)
  ctx.arcTo(r.x + r.w, r.y + r.h, r.x, r.y + r.h, rad)
  ctx.arcTo(r.x, r.y + r.h, r.x, r.y, rad)
  ctx.arcTo(r.x, r.y, r.x + r.w, r.y, rad)
  ctx.closePath()
}

function drawPlaceholder(ctx: Ctx, box: Rect): void {
  ctx.save()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.86)'
  ctx.strokeStyle = 'rgba(24, 24, 27, 0.35)'
  ctx.lineWidth = Math.max(2, box.w * 0.012)
  ctx.setLineDash([box.w * 0.07, box.w * 0.05])
  roundedPath(ctx, box, box.w * 0.06)
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

async function drawCard(ctx: Ctx, card: CardImage, box: Rect): Promise<void> {
  // A card whose object URL has been released cannot be drawn. One of those
  // must not take the rest of the picture down with it: the scene carries on
  // without it, so the damage shows as one missing card rather than a blank
  // preview with no clue what went wrong.
  let img
  try {
    img = await loadImage(card.src)
  }
  catch (error) {
    console.warn('cc-gen: a card image could not be loaded, leaving its slot empty', error)
    return
  }

  const drawn = containFit(img.naturalWidth, img.naturalHeight, box)
  ctx.drawImage(img, drawn.x, drawn.y, drawn.w, drawn.h)

  // When the frame was recognised, its own plate outlines are painted over the
  // card. They follow the plate's real shape, so no black spills onto the
  // artwork around it the way a bounding box would.
  if (card.mask) {
    try {
      const mask = await loadImage(card.mask.url)
      const { inset } = card.mask
      ctx.drawImage(
        mask,
        drawn.x + inset.x * drawn.w,
        drawn.y + inset.y * drawn.h,
        inset.w * drawn.w,
        inset.h * drawn.h,
      )
      return
    }
    catch (error) {
      // Fall through to the boxes rather than leaving a code uncovered.
      console.warn('cc-gen: could not load the frame mask', error)
    }
  }

  // Boxes are in card space, so they scale with however the card landed.
  ctx.save()
  ctx.fillStyle = '#000000'
  for (const r of card.redactions) {
    ctx.fillRect(
      drawn.x + (r.x / CARD.w) * drawn.w,
      drawn.y + (r.y / CARD.h) * drawn.h,
      (r.w / CARD.w) * drawn.w,
      (r.h / CARD.h) * drawn.h,
    )
  }
  ctx.restore()
}

/** The box a slot occupies, in canvas space. */
export function slotRect(slot: { x: number, y: number, scale: number }): Rect {
  return { x: slot.x, y: slot.y, w: CARD.w * slot.scale, h: CARD.h * slot.scale }
}

export async function renderScene(
  ctx: Ctx,
  scene: Scene,
  options: RenderOptions = {},
): Promise<void> {
  const { w, h } = scene.canvas

  ctx.clearRect(0, 0, w, h)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // Stretched to fill, never fitted. The canvas is already the nominal
  // background's shape, so anything slightly off gets pulled into line here.
  const background = await loadImage(scene.background.src)
  ctx.drawImage(background, 0, 0, w, h)

  for (let i = 0; i < scene.slots.length; i++) {
    const box = slotRect(scene.slots[i]!)
    const card = scene.cards[i]
    if (card) await drawCard(ctx, card, box)
    else if (options.placeholders) drawPlaceholder(ctx, box)
  }

  for (const anchor of scene.marks) {
    // The drawn size comes from the anchor, not from the loaded image. An SVG
    // reports whatever its root attributes say, so trusting that would let a
    // mark quietly fall back to its natural size if the substitution missed.
    let h = anchor.h
    let w = markWidth(anchor.kind, h)
    if (anchor.maxW && w > anchor.maxW) {
      h *= anchor.maxW / w
      w = anchor.maxW
    }
    const mark = await markImage(anchor.kind, h)
    ctx.drawImage(mark, anchor.cx - w / 2, anchor.cy - h / 2, w, h)
  }
}
