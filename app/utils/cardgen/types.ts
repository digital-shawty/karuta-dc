// Shared shapes for the card matchup generator.
//
// Two coordinate spaces matter here and mixing them up is the easiest way to
// break this thing:
//
//   canvas space  — pixels of the image being produced. Slots and mark anchors
//                   live here. The stage only ever scales the canvas with CSS,
//                   so what you see is what gets exported.
//   card space    — a fixed 274 x 405 grid mapped onto whatever a card image
//                   actually measures. Redaction boxes live here, which is why
//                   an off-size card still gets its code covered.

/** Every card slot is this size at scale 1. Cards are never drawn larger. */
export const CARD = { w: 274, h: 405 } as const

/** Layouts are described in units where one card is 10 units wide. */
export const UNIT = CARD.w / 10

/**
 * The size every background is treated as.
 *
 * Backgrounds come off the same template and land within a few pixels of this,
 * but not always exactly, and letting the canvas inherit whatever shape each
 * one happened to be made the output size wander between competitions. They
 * are stretched to fit instead. A percent or two of distortion is invisible in
 * the artwork, and in exchange every layout sits on the 5:3 canvas its
 * measurements were taken from.
 */
export const BACKGROUND = { w: 1920, h: 1152 } as const

export interface Rect { x: number, y: number, w: number, h: number }

export interface ImageAsset {
  /** Object URL. Revoke it when the asset is dropped. */
  src: string
  blob: Blob
  width: number
  height: number
}

/**
 * How a card's boxes were placed, best first.
 *
 * `frame`  the card's frame was recognised, so the plates are exact
 * `ocr`    the frame was unknown and the text was read instead
 * `pixel`  neither worked, but the dark bars were found by scanning
 * `fallback` nothing was found; the usual position is covered instead
 * `manual` a person moved them, and nothing may overwrite that
 */
export type DetectSource = 'frame' | 'ocr' | 'pixel' | 'fallback' | 'manual'

/**
 * The exact plate outlines for a recognised frame, drawn over the card.
 * Preferred over `redactions`, which is only their bounding boxes: a plate is
 * about 88% rectangular, so a box spills black onto the artwork around it.
 */
export interface CardMask {
  url: string
  /** Where the frame sits in the image, as fractions of its width and height. */
  inset: { x: number, y: number, w: number, h: number }
}

export interface CardImage extends ImageAsset {
  /** Boxes over the code and the print numbers, in card space. */
  redactions: Rect[]
  /** Exact outlines, when the frame was recognised. Falls back to the boxes. */
  mask?: CardMask
  detect: DetectSource
  /** Which frame was recognised, when one was. Shown when editing a card. */
  frame?: string
}

export type Mode = 'versus' | 'winners'
export type TeamSize = 'singles' | 'duos'
/** How many sides a matchup has. Duos still puts two cards on each side. */
export type MatchupSize = 'pair' | 'trio'

export type LayoutId =
  | 'cards-2' | 'cards-3' | 'pairs-2' | 'pairs-3'
  | 'winners-cards' | 'winners-pairs'

/** Top-left corner in canvas space. Size is CARD times scale, never above 1. */
export interface Slot { x: number, y: number, scale: number }

export type MarkKind = 'vs' | '1st' | '2nd' | '3rd'

/** A mark is placed by its centre and drawn to a height; width follows its art. */
export interface MarkAnchor {
  kind: MarkKind
  cx: number
  cy: number
  /** Drawn height. Width follows the art's own proportions. */
  h: number
  /**
   * Cap on the drawn width. The versus mark is a wide VS rather than a single
   * V, so on the tighter layouts the gap runs out before the height does and
   * this is what actually sizes it.
   */
  maxW?: number
}

/** Everything the renderer needs. Built by presets, never edited by hand. */
export interface Scene {
  background: ImageAsset
  canvas: { w: number, h: number }
  slots: Slot[]
  marks: MarkAnchor[]
  /** Parallel to `slots`. A hole renders as a placeholder in the preview. */
  cards: (CardImage | undefined)[]
}

export interface Setup {
  background?: ImageAsset
  mode: Mode
  teamSize: TeamSize
}

/** One entry in the versus gallery. */
export interface Matchup {
  id: string
  size: MatchupSize
  cards: (CardImage | undefined)[]
}
