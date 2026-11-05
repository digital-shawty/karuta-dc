// The art drawn on top of a matchup: one versus V and three rank marks.
//
// Each mark is an SVG of flat shapes with an outline, carrying exactly two
// colours. They are inlined as text so those colours can be swapped and an
// explicit pixel size set on the root before rasterising, which is what keeps
// a mark sharp whether it is drawn at 40 px or 200.
//
// Marks are sized by height; width follows the art's own proportions. That way
// a rank mark under a half-scale team comes out half the size of first place's
// without anyone doing arithmetic at the call site.

import rank1st from '~/assets/cardgen/marks/rank-1st.svg?raw'
import rank2nd from '~/assets/cardgen/marks/rank-2nd.svg?raw'
import rank3rd from '~/assets/cardgen/marks/rank-3rd.svg?raw'
import vsDefault from '~/assets/cardgen/marks/vs-default.svg?raw'
import type { MarkKind } from './types'

const SOURCES: Record<MarkKind, string> = {
  'vs': vsDefault,
  '1st': rank1st,
  '2nd': rank2nd,
  '3rd': rank3rd,
}

/** The colours every mark ships with: white face, black outline. */
export const MARK_FACE = '#ffffff'
export const MARK_EDGE = '#000000'

const cache = new Map<string, HTMLImageElement>()

/**
 * A mark's own proportions, read from its viewBox.
 * The origin is not always zero: an outline-only mark pulls its box outward to
 * leave room for the stroke, which straddles the path.
 */
function naturalSize(svg: string): { w: number, h: number } {
  const box = svg.match(/viewBox="(-?[\d.]+)\s+(-?[\d.]+)\s+([\d.]+)\s+([\d.]+)"/)
  if (!box) throw new Error('mark is missing a viewBox')
  return { w: Number(box[3]), h: Number(box[4]) }
}

/** How wide a mark comes out when drawn to the given height. */
export function markWidth(kind: MarkKind, height: number): number {
  const { w, h } = naturalSize(SOURCES[kind])
  return (height * w) / h
}

/**
 * A mark rasterised at the size it will be drawn. Cached, because a versus
 * image redraws on every keystroke in the builder and the marks never change.
 */
export async function markImage(
  kind: MarkKind,
  height: number,
  face = MARK_FACE,
  edge = MARK_EDGE,
): Promise<HTMLImageElement> {
  const h = Math.max(1, Math.round(height))
  const w = Math.max(1, Math.round(markWidth(kind, h)))
  const key = `${kind}|${w}x${h}|${face}|${edge}`

  const cached = cache.get(key)
  if (cached) return cached

  // The versus mark has no fill at all, being outline only, so that first
  // substitution simply finds nothing to do on it.
  const svg = SOURCES[kind]
    .replace('fill="#ffffff"', `fill="${face}"`)
    .replace('stroke="#000000"', `stroke="${edge}"`)
    .replace(/width="[\d.]+" height="[\d.]+"/, `width="${w}" height="${h}"`)

  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    cache.set(key, img)
    return img
  }
  finally {
    // Safe once decode has resolved: the bitmap is already in memory.
    URL.revokeObjectURL(url)
  }
}
