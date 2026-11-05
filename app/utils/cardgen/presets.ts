// Where every card and mark goes, for all six layouts.
//
// Positions are not hand-placed. Each versus layout is described in units
// where one card is 10 wide, measured off Ali's rendered matchups, and the
// canvas is sized so a card comes out at its native 274 x 405.
//
// Cards are never drawn above native size, so the only way to make them fill
// more of a matchup is to give them less room to sit in: the margins and gaps
// are kept tight, which shrinks the canvas, and the background is scaled down
// into it. A card redrawn larger would only be a blurrier card.
//
// Every layout is built against BACKGROUND rather than the uploaded file, so
// the canvas comes out the same size every time and the background is
// stretched to fill it. The canvas is capped at that nominal width, which no
// layout now reaches; it is the guard that stops a future wider strip from
// asking for a background bigger than there is. Winners singles goes the
// other way, drawing its three cards above native size to fill the plinths on
// the podium template. Every other layout draws a card at exactly 274 x 405.

import {
  BACKGROUND, CARD, UNIT,
  type CardImage, type LayoutId, type MarkAnchor, type MatchupSize,
  type Mode, type Scene, type Setup, type Slot, type TeamSize,
} from './types'

interface Strip {
  /** Units of empty space at each end. */
  margin: number
  /** Units between one side and the next. A versus mark sits in the middle. */
  teamGap: number
  /** Units between partners. Normalised across every layout. */
  duoGap: number
  teams: number
  perTeam: number
}

/** Partners sit this far apart everywhere, in units. */
const DUO_GAP = 0.6

/**
 * Measured off Ali's matchups, as `margin : C : gap : C : margin`.
 *
 * The numbers are the spacing the cards want, not the spacing a 1920 canvas
 * happens to leave over: a singles pair at 32 units puts a card across about
 * a third of the width, which is where the reference renders sit. Three cards
 * abreast have far less to give away, so their gaps come down to roughly the
 * width of the versus mark and no more.
 */
const STRIPS: Record<'cards-2' | 'cards-3' | 'pairs-2' | 'pairs-3', Strip> = {
  // 2 : C : 8 : C : 2
  'cards-2': { margin: 2, teamGap: 8, duoGap: 0, teams: 2, perTeam: 1 },
  // 1 : C : 2.5 : C : 2.5 : C : 1
  'cards-3': { margin: 1, teamGap: 2.5, duoGap: 0, teams: 3, perTeam: 1 },
  // Four cards abreast, so the strip carries the partner gap as well.
  'pairs-2': { margin: 1, teamGap: 3, duoGap: DUO_GAP, teams: 2, perTeam: 2 },
  // Six at native size now fit inside a 1920 background; they used to not.
  'pairs-3': { margin: 1, teamGap: 2.5, duoGap: DUO_GAP, teams: 3, perTeam: 2 },
}

/**
 * Winners has its own canvas, unchanged by the versus strips above.
 *
 * Every podium position is a fraction of the canvas, measured against the
 * plinths drawn on the template, so the cards only land on them while the
 * canvas stays the width those fractions were taken at.
 */
const WINNERS_UNITS = 46

/**
 * Winners singles, measured off Ali's podium template.
 *
 * All three places are the same size and sit on one baseline, with first
 * lifted clear of it. The ranking is not read off the cards: the 1st, 2nd and
 * 3rd markers are part of the background art, so the layout only has to drop
 * each card on the plinth already drawn for it.
 *
 * In logical order, first then second then third, which is the order the
 * slots come out in everywhere.
 */
const PODIUM_BOTTOM = 0.833
/** Winners cards are drawn larger than native, to fill the template. */
const PODIUM_SCALE = 1.2
const PODIUM = [
  { cx: 0.500, lift: 0.072 },
  { cx: 0.158, lift: 0 },
  { cx: 0.842, lift: 0 },
] as const

/**
 * Winners duos is asymmetric: the first-place duo fills the left half at
 * native size, with second and third stacked on the right at about half scale.
 * Its markers come from the background too.
 */
const PODIUM_PAIRS = [
  { scale: 1.00, cx: 0.300, cy: 0.464 },
  { scale: 0.54, cx: 0.819, cy: 0.278 },
  { scale: 0.54, cx: 0.819, cy: 0.709 },
] as const

/**
 * Versus mark height, as a share of the card height beside it.
 *
 * This only sizes the mark on a singles pair, the one layout with room to
 * spare between the cards. Everywhere else the gap runs out first and
 * VS_GAP_SHARE is what decides, so changing this leaves those alone.
 */
const VS_HEIGHT = 0.10
/**
 * Widest the versus mark may be, as a share of the gap it sits in.
 *
 * Tight gaps are what sizes the mark on every layout but the singles pair,
 * so it takes most of the gap it is given rather than floating in the middle
 * of one. Its outline carries the weight at that size.
 */
const VS_GAP_SHARE = 0.8
/** The mark sits a touch above the cards' centre line, as the render does. */
const VS_LIFT = 0.03

export function cardCount(teamSize: TeamSize, size: MatchupSize): number {
  return (size === 'pair' ? 2 : 3) * (teamSize === 'duos' ? 2 : 1)
}

/**
 * How to deal a pile of cards out into matchups.
 *
 * Trios are used as sparingly as possible, because a pile that divides evenly
 * into pairs should come out as pairs. Seven singles cards make three pairs
 * and one trio; five make a pair and a trio. Duos works the same way on its
 * own counts, where a pair holds four cards and a trio six.
 *
 * `leftover` is what will not fit: one card in singles, up to three in duos.
 * It is always less than a pair, so the caller can open a half-filled pair
 * with it rather than throwing it away.
 */
export function groupSizes(teamSize: TeamSize, count: number): {
  sizes: MatchupSize[]
  leftover: number
} {
  const perPair = cardCount(teamSize, 'pair')
  const perTrio = cardCount(teamSize, 'trio')

  let best = { pairs: 0, trios: 0, leftover: count }
  for (let trios = 0; trios * perTrio <= count; trios++) {
    const rest = count - trios * perTrio
    const pairs = Math.floor(rest / perPair)
    const leftover = rest - pairs * perPair
    // Ascending trios, so the first way to use every card uses the fewest.
    if (leftover < best.leftover) best = { pairs, trios, leftover }
  }

  return {
    sizes: [
      ...Array.from({ length: best.pairs }, () => 'pair' as const),
      ...Array.from({ length: best.trios }, () => 'trio' as const),
    ],
    leftover: best.leftover,
  }
}

/**
 * Deal every card back out across the same matchups.
 *
 * One pile, shuffled, then cut back into the shapes it came from, so a card
 * from the first matchup can land in the last and a trio stays a trio. That
 * is the point of the button: the matchups themselves are rebuilt, not merely
 * reordered, which would leave every pairing exactly as it was.
 *
 * Generic and given its own source of randomness, so the checks can run it
 * on known numbers and see where each one ended up.
 */
export function redealCards<T>(
  groups: readonly (readonly T[])[],
  random: () => number = Math.random,
): T[][] {
  const pile = groups.flat()
  for (let i = pile.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const held = pile[i]!
    pile[i] = pile[j]!
    pile[j] = held
  }

  let at = 0
  return groups.map((group) => {
    const dealt = pile.slice(at, at + group.length)
    at += group.length
    return dealt
  })
}

export function layoutFor(mode: Mode, teamSize: TeamSize, size: MatchupSize): LayoutId {
  if (mode === 'winners') return teamSize === 'duos' ? 'winners-pairs' : 'winners-cards'
  if (teamSize === 'duos') return size === 'pair' ? 'pairs-2' : 'pairs-3'
  return size === 'pair' ? 'cards-2' : 'cards-3'
}

/** Winners always has three places, so its matchup size is fixed. */
export function slotCount(mode: Mode, teamSize: TeamSize, size: MatchupSize): number {
  if (mode === 'winners') return teamSize === 'duos' ? 6 : 3
  return cardCount(teamSize, size)
}

function unitsOf(s: Strip): number {
  return 2 * s.margin
    + s.teams * s.perTeam * 10
    + (s.teams - 1) * s.teamGap
    + s.teams * (s.perTeam - 1) * s.duoGap
}

/**
 * Canvas width for a layout, and how much every card shrinks to fit it.
 *
 * `w` is the exported pixel width, so it is a whole number. `span` is the
 * width the layout actually occupies before that rounding, which is what the
 * strip is laid out against: taking the scale from the rounded width instead
 * would shave a fraction of a pixel off every card and stop them being native
 * size. The leftover fraction is split between the two margins by the caller.
 */
function fit(units: number) {
  const wanted = units * UNIT
  const span = Math.min(wanted, BACKGROUND.w)
  return { w: Math.round(span), span, scale: span / wanted }
}

/** Canvases keep the nominal background's shape, whatever was uploaded. */
function heightFor(canvasW: number): number {
  return Math.round(BACKGROUND.h * (canvasW / BACKGROUND.w))
}

/**
 * How far an uploaded background is from the shape it will be stretched into.
 * `distortion` is the share by which its aspect has to change: 0 is a perfect
 * fit, and 0.067 is a 16:9 image being pulled to 5:3.
 */
export function backgroundFit(asset: { width: number, height: number }) {
  const target = BACKGROUND.w / BACKGROUND.h
  return {
    exact: asset.width === BACKGROUND.w && asset.height === BACKGROUND.h,
    distortion: Math.abs((asset.width / asset.height) / target - 1),
    upscale: Math.max(0, BACKGROUND.w / asset.width - 1),
  }
}

function versusScene(id: 'cards-2' | 'cards-3' | 'pairs-2' | 'pairs-3') {
  const strip = STRIPS[id]
  const { w: canvasW, span, scale } = fit(unitsOf(strip))
  const canvasH = heightFor(canvasW)

  const u = UNIT * scale
  const cardW = CARD.w * scale
  const cardH = CARD.h * scale
  const y = (canvasH - cardH) / 2

  const slots: Slot[] = []
  const marks: MarkAnchor[] = []
  // Centre the strip in the rounded canvas so both margins come out equal.
  let x = (canvasW - span) / 2 + strip.margin * u

  for (let team = 0; team < strip.teams; team++) {
    if (team > 0) {
      const from = x
      x += strip.teamGap * u
      marks.push({
        kind: 'vs',
        cx: (from + x) / 2,
        cy: y + cardH / 2 - VS_LIFT * cardH,
        h: VS_HEIGHT * cardH,
        maxW: strip.teamGap * u * VS_GAP_SHARE,
      })
    }
    for (let seat = 0; seat < strip.perTeam; seat++) {
      if (seat > 0) x += strip.duoGap * u
      slots.push({ x, y, scale })
      x += cardW
    }
  }

  return { canvas: { w: canvasW, h: canvasH }, slots, marks }
}

function winnersCardsScene() {
  const { w: canvasW, scale: base } = fit(WINNERS_UNITS)
  const canvasH = heightFor(canvasW)
  const scale = base * PODIUM_SCALE
  const cardW = CARD.w * scale
  const cardH = CARD.h * scale

  const slots: Slot[] = PODIUM.map((place) => {
    const bottom = (PODIUM_BOTTOM - place.lift) * canvasH
    return { x: place.cx * canvasW - cardW / 2, y: bottom - cardH, scale }
  })

  return { canvas: { w: canvasW, h: canvasH }, slots, marks: [] }
}

function winnersPairsScene() {
  const { w: canvasW, scale: base } = fit(WINNERS_UNITS)
  const canvasH = heightFor(canvasW)

  const slots: Slot[] = []

  for (const place of PODIUM_PAIRS) {
    const scale = base * place.scale
    const cardW = CARD.w * scale
    const cardH = CARD.h * scale
    const gap = DUO_GAP * UNIT * scale
    const teamW = cardW * 2 + gap
    const left = place.cx * canvasW - teamW / 2
    const y = place.cy * canvasH - cardH / 2

    slots.push({ x: left, y, scale })
    slots.push({ x: left + cardW + gap, y, scale })
  }

  return { canvas: { w: canvasW, h: canvasH }, slots, marks: [] }
}

/**
 * Turn a setup plus a row of cards into something the renderer can draw.
 * `cards` is positional and may contain holes; those show as placeholders.
 */
export function buildScene(
  setup: Setup & { background: NonNullable<Setup['background']> },
  size: MatchupSize,
  cards: (CardImage | undefined)[],
): Scene {
  const id = layoutFor(setup.mode, setup.teamSize, size)

  const parts = id === 'winners-cards'
    ? winnersCardsScene()
    : id === 'winners-pairs'
      ? winnersPairsScene()
      : versusScene(id)

  return {
    background: setup.background,
    ...parts,
    cards: parts.slots.map((_, i) => cards[i]),
  }
}
