// What the card comp generator is checked against.
//
// Three suites, all of them pure maths that would be tedious and unreliable to
// confirm by eye:
//
//   layouts    every canvas size, slot and mark anchor, asserted against the
//              measurements taken off Ali's rendered competition images
//   drawing    fitting a card into its slot and mapping its redaction boxes
//              onto wherever that card actually landed
//   detection  the dark-pill scanner, on cards built pixel by pixel so the
//              right answer is known in advance
//   dealing    how a pile of uploaded cards is split into matchups, and how
//              shuffle deals them out again
//   releasing  which card images are safe to let go of after an edit
//   frames     the generated frame library is well formed, and the matcher
//              recognises real cards from the bot, dye and all
//
// Run with `npm run check:cardgen`.

import { readFileSync } from 'node:fs'
import { detectPills } from '~/utils/cardgen/detect'
import { FRAME_DATA, FRAME_PRINT } from '~/utils/cardgen/frame-data'
import { acceptMatch, cardPrint, dropFrames, parseTable, rankPrint, RING_LEN } from '~/utils/cardgen/frames'
import { decodePng } from './png'
import { backgroundFit, buildScene, cardCount, groupSizes, layoutFor, redealCards, slotCount } from '~/utils/cardgen/presets'
import { released } from '~/utils/cardgen/images'
import { defaultRedactions, fromDetection } from '~/utils/cardgen/redact'
import { BACKGROUND, CARD } from '~/utils/cardgen/types'

let fails = 0
let suite = ''

function section(name: string) {
  suite = name
  console.log(`\n${name}`)
}

function check(label: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) fails++
  console.log(`  ${ok ? 'pass' : 'FAIL'}  ${label}${ok ? '' : `  got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`)
}

function near(label: string, got: number, want: number, tol = 1) {
  const ok = Math.abs(got - want) <= tol
  if (!ok) fails++
  console.log(`  ${ok ? 'pass' : 'FAIL'}  ${label}${ok ? '' : `  got ${got}, want about ${want}`}`)
}

const bg = { src: 'size-1920x1152', blob: null, width: 1920, height: 1152 } as never
const setup = (mode: string, teamSize: string) => ({ background: bg, mode, teamSize }) as never
const round = (n: number) => Math.round(n * 10) / 10

// ---------------------------------------------------------------- layouts

section('layouts')

check('versus singles pair is cards-2', layoutFor('versus', 'singles', 'pair'), 'cards-2')
check('versus duos trio is pairs-3', layoutFor('versus', 'duos', 'trio'), 'pairs-3')
check('winners duos is winners-pairs', layoutFor('winners', 'duos', 'pair'), 'winners-pairs')
check('a duos trio holds six cards', cardCount('duos', 'trio'), 6)
check('winners duos has six slots', slotCount('winners', 'duos', 'pair'), 6)

for (const [mode, team, size, want] of [
  ['versus', 'singles', 'pair', [1260, 756]],
  ['versus', 'singles', 'trio', [1260, 756]],
  ['versus', 'duos', 'pair', [1408, 845]],
  ['versus', 'duos', 'trio', [1920, 1152]],
  ['winners', 'singles', 'pair', [1260, 756]],
  ['winners', 'duos', 'pair', [1260, 756]],
] as [string, string, 'pair' | 'trio', number[]][]) {
  const scene = buildScene(setup(mode, team), size, [])
  check(`${mode} ${team} ${size} canvas`, [scene.canvas.w, scene.canvas.h], want)
}

// The duos pair is the one layout measured from a finished render, so it is
// the strongest evidence the whole scaling model is right.
const duo = buildScene(setup('versus', 'duos'), 'pair', [])
check('duos pair: cards come out native size',
  [round(CARD.w * duo.slots[0]!.scale), round(CARD.h * duo.slots[0]!.scale)], [274, 405])
check('duos pair: one versus mark', duo.marks.map(m => m.kind), ['vs'])
near('duos pair: mark centred between the sides', duo.marks[0]!.cx, duo.canvas.w / 2)
check('every versus mark is capped to its gap',
  (['pair', 'trio'] as const).every(size =>
    (['singles', 'duos'] as const).every(team =>
      buildScene(setup('versus', team), size, []).marks
        .every(m => typeof m.maxW === 'number' && m.maxW > 0))), true)
near('duos pair: partners sit 1.2 units apart',
  duo.slots[1]!.x - (duo.slots[0]!.x + CARD.w), 1.2 * 27.4)
near('duos pair: sides sit 7 units apart',
  duo.slots[2]!.x - (duo.slots[1]!.x + CARD.w), 7 * 27.4)
near('duos pair: margins match',
  duo.slots[0]!.x, duo.canvas.w - (duo.slots[3]!.x + CARD.w), 0.01)

const trio = buildScene(setup('versus', 'duos'), 'trio', [])
check('duos trio: six slots and two marks', [trio.slots.length, trio.marks.length], [6, 2])
near('duos trio: the cap shrinks cards to 0.93', trio.slots[0]!.scale, 0.927, 0.005)
check('duos trio: the last card stays on the canvas',
  trio.slots[5]!.x + CARD.w * trio.slots[5]!.scale <= trio.canvas.w, true)

// Every slot gets a drag handle laid over the preview, positioned as a
// percentage of the canvas, so a slot that strayed outside would put an
// invisible target over the page instead of over its card.
check('every layout keeps its slots on the canvas',
  ([['versus', 'singles', 'pair'], ['versus', 'singles', 'trio'], ['versus', 'duos', 'pair'],
    ['versus', 'duos', 'trio'], ['winners', 'singles', 'pair'], ['winners', 'duos', 'pair']] as
    [string, string, 'pair' | 'trio'][])
    .every(([mode, team, size]) => {
      const scene = buildScene(setup(mode, team), size, [])
      return scene.slots.every(slot =>
        slot.x >= 0 && slot.y >= 0
        && slot.x + CARD.w * slot.scale <= scene.canvas.w + 0.5
        && slot.y + CARD.h * slot.scale <= scene.canvas.h + 0.5)
    }), true)

// The rank markers are part of the background art, so a winners scene places
// cards and nothing else.
const podium = buildScene(setup('winners', 'singles'), 'pair', [])
check('winners: no marks of its own', podium.marks.length, 0)
check('winners: every place the same size',
  podium.slots.map(s => Math.round(s.scale * 1000) / 1000), [1.2, 1.2, 1.2])
const bottoms = podium.slots.map(s => Math.round(s.y + CARD.h * s.scale))
check('winners: second and third share a baseline', bottoms[1] === bottoms[2], true)
check('winners: first sits above it', bottoms[0]! < bottoms[1]!, true)
check('winners: second and third are mirrored about the centre',
  Math.round(podium.slots[1]!.x + podium.slots[2]!.x + CARD.w * podium.slots[1]!.scale),
  podium.canvas.w)
check('winners: nothing leaves the canvas', podium.slots.every(s =>
  s.x >= 0 && s.y >= 0
  && s.x + CARD.w * s.scale <= podium.canvas.w
  && s.y + CARD.h * s.scale <= podium.canvas.h), true)
// Full-size places have far less room between them than the old graded ones.
const inOrder = [...podium.slots].sort((a, b) => a.x - b.x)
check('winners: the three places clear each other', inOrder.every((s, i) =>
  i === 0 || inOrder[i - 1]!.x + CARD.w * inOrder[i - 1]!.scale <= s.x), true)

const podiumDuo = buildScene(setup('winners', 'duos'), 'pair', [])
check('winners duos: six slots and no marks',
  [podiumDuo.slots.length, podiumDuo.marks.length], [6, 0])
check('winners duos: first place clears the right-hand column',
  podiumDuo.slots[1]!.x + CARD.w * podiumDuo.slots[1]!.scale < podiumDuo.slots[2]!.x, true)
check('winners duos: nothing leaves the canvas', podiumDuo.slots.every(s =>
  s.x >= 0 && s.y >= 0
  && s.x + CARD.w * s.scale <= podiumDuo.canvas.w
  && s.y + CARD.h * s.scale <= podiumDuo.canvas.h), true)
check('winners duos: second and third stack in the same column',
  Math.round(podiumDuo.slots[2]!.x) === Math.round(podiumDuo.slots[4]!.x), true)

// Backgrounds are stretched to the nominal size, so nothing about the canvas
// may depend on what was actually uploaded.
// ------------------------------------------------------------ multi groups

section('dealing a pile into matchups')

const deal = (team: string, n: number) => {
  const { sizes, leftover } = groupSizes(team as never, n)
  return `${sizes.join('+') || 'none'}${leftover ? ` +${leftover} left` : ''}`
}

for (const [n, want] of [
  [1, 'none +1 left'],
  [2, 'pair'],
  [3, 'trio'],
  [4, 'pair+pair'],
  [5, 'pair+trio'],
  [6, 'pair+pair+pair'],
  [7, 'pair+pair+trio'],
  [9, 'pair+pair+pair+trio'],
  [12, 'pair+pair+pair+pair+pair+pair'],
] as [number, string][]) {
  check(`singles: ${n} cards`, deal('singles', n), want)
}

for (const [n, want] of [
  [2, 'none +2 left'],
  [4, 'pair'],
  [6, 'trio'],
  [8, 'pair+pair'],
  [10, 'pair+trio'],
] as [number, string][]) {
  check(`duos: ${n} cards`, deal('duos', n), want)
}

check('no pile is left with a whole pair unplaced',
  (['singles', 'duos'] as const).every(team =>
    Array.from({ length: 40 }, (_, n) =>
      groupSizes(team, n).leftover < cardCount(team, 'pair')).every(Boolean)), true)
check('every card is either placed or counted as leftover',
  (['singles', 'duos'] as const).every(team =>
    Array.from({ length: 40 }, (_, n) => {
      const { sizes, leftover } = groupSizes(team, n)
      return sizes.reduce((sum, size) => sum + cardCount(team, size), 0) + leftover === n
    }).every(Boolean)), true)
check('trios are only used where pairs will not do',
  groupSizes('singles', 8).sizes.includes('trio'), false)
check('leftovers always fit in a half-filled pair',
  (['singles', 'duos'] as const).every(team =>
    Array.from({ length: 40 }, (_, n) =>
      groupSizes(team, n).leftover <= cardCount(team, 'pair') - 1).every(Boolean)), true)

// Shuffle has to produce new fixtures, not merely a new running order, so it
// is checked on cards that can be told apart.

/** A small repeatable generator, so a failure can be looked at twice. */
function seeded(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648
    return state / 2147483648
  }
}

const before = [['1A', '2A'], ['1B', '2B'], ['1C', '2C', '3C']]
const after = redealCards(before, seeded(7))

check('shuffle keeps every matchup the size it was',
  after.map(group => group.length), before.map(group => group.length))
check('shuffle keeps every card, once',
  after.flat().slice().sort(), before.flat().slice().sort())
check('shuffle mixes cards between matchups, not just within them',
  after.some((group, i) => group.some(card => !before[i]!.includes(card))), true)

// Ali's own example: two pairs must be able to come back as crossed pairs.
let crossed = false
for (let seed = 1; seed < 200 && !crossed; seed++) {
  const dealt = redealCards([['1A', '2A'], ['1B', '2B']], seeded(seed))
  crossed = dealt[0]!.includes('1A') && dealt[0]!.includes('2B')
    && dealt[1]!.includes('2A') && dealt[1]!.includes('1B')
}
check('two pairs can come back crossed, one card from each', crossed, true)

const every = new Set<string>()
for (let seed = 1; seed < 400; seed++) {
  every.add(redealCards(before, seeded(seed)).map(group => group.join('')).join('|'))
}
check('shuffle reaches many different draws, not a handful', every.size > 50, true)

check('shuffling nothing is harmless', redealCards([], seeded(1)), [])

// ---------------------------------------------------------------- releasing
//
// Every object URL has to be released exactly once: too early and a picture
// still on screen turns into a broken image, never and the blob is held for
// the life of the tab. Cards move by swapping places, so this is asked as a
// set and never slot by slot.

section('releasing card images')

const [A, B, C, D] = ['A', 'B', 'C', 'D']

check('a card that only moved slot is kept',
  released([A, B, C], [B, A, C]), [])
check('a rotation keeps every card',
  released([A, B, C], [C, A, B]), [])
check('a replaced card is released', released([A, B, C], [D, B, C]), [A])
check('a cleared card is released', released([A, B, C], [undefined, B, C]), [A])
check('a card swapped away and then replaced is released',
  released([A, B, C], [B, D, C]), [A])
check('nothing kept releases everything', released([A, B], []), [A, B])
check('holes are not releasable', released([undefined, A], [A]), [])
check('a card is only released once', released([A, A], []), [A])

// The bug this guards: confirming an edit that swapped two cards used to
// compare slot against slot, which made both look replaced and revoked both.
const edited = [B, A, C]
check('confirming a swapped edit releases nothing',
  released([A, B, C], edited), [])
check('confirming an edit that swapped and replaced releases only the loser',
  released([A, B, C], [B, C, D]), [A])

section('background normalising')

const shapes = [
  ['exact', 1920, 1152],
  ['a few pixels out', 1912, 1148],
  ['sixteen by nine', 1920, 1080],
  ['much smaller', 1280, 768],
  ['much larger', 3840, 2304],
] as [string, number, number][]

for (const [label, width, height] of shapes) {
  for (const [team, size] of [['singles', 'pair'], ['duos', 'trio']] as [string, 'pair' | 'trio'][]) {
    const scene = buildScene(
      { background: { ...bg, width, height }, mode: 'versus', teamSize: team } as never, size, [])
    const want = buildScene(setup('versus', team), size, [])
    check(`${label} gives the standard ${team} ${size} canvas`,
      [scene.canvas.w, scene.canvas.h], [want.canvas.w, want.canvas.h])
  }
}

check('every canvas keeps the nominal shape', [
  buildScene(setup('versus', 'singles'), 'pair', []),
  buildScene(setup('versus', 'duos'), 'trio', []),
  buildScene(setup('winners', 'duos'), 'pair', []),
].every(sc => Math.abs(sc.canvas.w / sc.canvas.h - BACKGROUND.w / BACKGROUND.h) < 0.005), true)

check('an exact background reports as exact',
  backgroundFit({ width: 1920, height: 1152 }).exact, true)
near('sixteen by nine distorts by about 7 percent',
  backgroundFit({ width: 1920, height: 1080 }).distortion, 0.067, 0.005)
near('a slightly off background barely distorts',
  backgroundFit({ width: 1912, height: 1148 }).distortion, 0, 0.01)
near('a small background reports how far it is upscaled',
  backgroundFit({ width: 1280, height: 768 }).upscale, 0.5, 0.01)
check('a large background is not an upscale',
  backgroundFit({ width: 3840, height: 2304 }).upscale, 0)

// ---------------------------------------------------------------- drawing

section('drawing')

const calls: { op: string, src?: string, args: number[] }[] = []

class FakeImage {
  naturalWidth = 0
  naturalHeight = 0
  width = 0
  height = 0
  #src = ''
  set src(value: string) {
    this.#src = value
    const found = /size-(\d+)x(\d+)/.exec(value)
    this.naturalWidth = this.width = found ? Number(found[1]) : 120
    this.naturalHeight = this.height = found ? Number(found[2]) : 152
  }

  get src() { return this.#src }
  decode() { return Promise.resolve() }
}

const globals = globalThis as Record<string, unknown>
globals.Image = FakeImage
globals.Blob = class { constructor(public parts: unknown[]) {} }
globals.URL = { createObjectURL: () => 'blob:mark', revokeObjectURL: () => {} }

const ctx = new Proxy({}, {
  get: (_t, prop: string) => {
    if (prop === 'drawImage') {
      return (img: { src: string }, ...args: number[]) =>
        calls.push({ op: 'drawImage', src: img.src, args })
    }
    if (prop === 'fillRect') return (...args: number[]) => calls.push({ op: 'fillRect', args })
    return () => {}
  },
  set: () => true,
}) as never

const { renderScene } = await import('~/utils/cardgen/render')

const card = (w: number, h: number) => ({
  src: `size-${w}x${h}`, blob: null, width: w, height: h,
  redactions: defaultRedactions(), detect: 'fallback',
} as never)

const [topBox] = defaultRedactions() as [{ x: number, y: number, w: number, h: number }]

const native = buildScene(setup('versus', 'duos'), 'pair',
  [card(274, 405), card(274, 405), card(274, 405), card(274, 405)])
await renderScene(ctx, native)

check('background fills the canvas', calls[0]!.args, [0, 0, native.canvas.w, native.canvas.h])
const drawn = calls.filter(c => c.op === 'drawImage' && c.src === 'size-274x405')
check('every card is drawn once', drawn.length, 4)
check('a native card fills its slot exactly', drawn[0]!.args.slice(2), [274, 405])
const boxes = calls.filter(c => c.op === 'fillRect')
check('two boxes are painted per card', boxes.length, 8)
near('a box follows its card', boxes[0]!.args[0]!, native.slots[0]!.x + topBox.x)
near('a box keeps its size at scale 1', boxes[0]!.args[2]!, topBox.w)
const mark = calls.find(c => c.op === 'drawImage' && String(c.src).startsWith('blob:'))!
near('the mark is drawn at the capped width, not the image size',
  mark.args[2]!, native.marks[0]!.maxW!)
near('the mark is centred on its anchor', mark.args[0]! + mark.args[2]! / 2, native.marks[0]!.cx)
check('the mark fits the gap it sits in',
  mark.args[2]! < native.slots[2]!.x - (native.slots[1]!.x + CARD.w), true)
check('capping the width keeps the mark in proportion',
  Math.abs(mark.args[2]! / mark.args[3]! - 232 / 112) < 0.02, true)

// An off-size card must letterbox inside its slot, and its boxes must follow.
calls.length = 0
const odd = buildScene(setup('versus', 'singles'), 'pair', [card(548, 405), undefined as never])
await renderScene(ctx, odd)
const fitted = calls.find(c => c.op === 'drawImage' && c.src === 'size-548x405')!
near('a wide card fits the slot width', fitted.args[2]!, CARD.w)
near('a wide card keeps its aspect', fitted.args[3]!, 405 * (CARD.w / 548))
near('a wide card is centred in its slot',
  fitted.args[1]! + fitted.args[3]! / 2, odd.slots[0]!.y + CARD.h / 2)
const oddBox = calls.find(c => c.op === 'fillRect')!
near('a box scales with the letterboxed card',
  oddBox.args[2]!, (topBox.w / CARD.w) * fitted.args[2]!)
near('a box sits inside the drawn card',
  oddBox.args[1]!, fitted.args[1]! + (topBox.y / CARD.h) * fitted.args[3]!)

// -------------------------------------------------------------- detection

section('detection')

function makeCard(pills: { x: number, y: number, w: number, h: number }[], art = 200) {
  const d = new Uint8ClampedArray(CARD.w * CARD.h * 4)
  for (let i = 0; i < d.length; i += 4) {
    d[i] = d[i + 1] = d[i + 2] = art
    d[i + 3] = 255
  }
  for (const p of pills) {
    for (let y = p.y; y < p.y + p.h; y++) {
      for (let x = p.x; x < p.x + p.w; x++) {
        const i = (y * CARD.w + x) * 4
        d[i] = d[i + 1] = d[i + 2] = 10
      }
    }
  }
  return d
}

const TOP = { x: 92, y: 10, w: 90, h: 22 }
const BOTTOM = { x: 104, y: 372, w: 66, h: 20 }
const covers = (box: { x: number, y: number, w: number, h: number } | undefined,
  pill: typeof TOP) => Boolean(box
  && box.x <= pill.x && box.y <= pill.y
  && box.x + box.w >= pill.x + pill.w
  && box.y + box.h >= pill.y + pill.h)

const both = detectPills(makeCard([TOP, BOTTOM]))
check('finds both pills', [Boolean(both.top), Boolean(both.bottom)], [true, true])
check('the top box covers the code', covers(both.top, TOP), true)
check('the bottom box covers the numbers', covers(both.bottom, BOTTOM), true)
check('a find is reported as detected', fromDetection(both).detect, 'pixel')

// A dark card frame runs the full height and must not be read as a pill.
const framed = makeCard([TOP, BOTTOM])
for (let y = 0; y < CARD.h; y++) {
  for (let x = 0; x < CARD.w; x++) {
    if (x < 14 || x > CARD.w - 14) {
      const i = (y * CARD.w + x) * 4
      framed[i] = framed[i + 1] = framed[i + 2] = 5
    }
  }
}
const withFrame = detectPills(framed)
check('a dark frame does not stretch the box', withFrame.top!.w < CARD.w * 0.8, true)
check('a framed card still has its code covered', covers(withFrame.top, TOP), true)

const plain = detectPills(makeCard([]))
check('nothing is invented on a plain card', [plain.top, plain.bottom], [undefined, undefined])
check('a plain card falls back', fromDetection(plain).detect, 'fallback')
check('a fallback still returns two boxes', fromDetection(plain).redactions.length, 2)

const oneSided = fromDetection(detectPills(makeCard([TOP])))
check('one find still counts as detected', oneSided.detect, 'pixel')
check('the missed pill keeps its default', oneSided.redactions[1]!.y, 362)

const edge = detectPills(makeCard([{ x: 92, y: 0, w: 90, h: 20 }]))
check('a box never leaves the card', edge.top!.x >= 0 && edge.top!.y >= 0
  && edge.top!.x + edge.top!.w <= CARD.w
  && edge.top!.y + edge.top!.h <= CARD.h, true)

// ------------------------------------------------------------ frame table

section('frame table')

const lines = FRAME_DATA.trim().split('\n')
check('the table has frames in it', lines.length > 300, true)

let malformed = 0
let offCard = 0
const ids = new Set<string>()
for (const line of lines) {
  const parts = line.split('|')
  if (parts.length !== 4) { malformed++; continue }
  const [id, top, bottom] = parts as [string, string, string, string]
  ids.add(id)
  for (const plate of [top, bottom]) {
    const [x, y, w, h] = plate.split(',').map(Number) as [number, number, number, number]
    // Thousandths of the frame, so a plate must sit inside it.
    if (x < 0 || y < 0 || w <= 0 || h <= 0 || x + w > 1000 || y + h > 1000) offCard++
  }
}

check('every row parses', malformed, 0)
check('every plate sits inside its frame', offCard, 0)
check('frame names are unique', ids.size, lines.length)
check('a frame uploaded twice is kept once, under its clean name',
  [...ids].filter(id => /\(\d+\)$/.test(id)), [])

// Each frame's plate outlines are fetched at match time, so a missing file
// would silently drop a card back to its bounding boxes.
const { existsSync } = await import('node:fs')
const missingMasks = [...ids].filter(id => !existsSync(`public/card-frame-masks/${id}.png`))
check('every frame has its mask file', missingMasks.length, 0)
if (missingMasks.length) console.log('    missing:', missingMasks.slice(0, 5).join(', '))

const sprite = decodePng(readFileSync(`public${FRAME_PRINT.url}`))
check('the sprite holds a ring and a weight row for every frame',
  [sprite.width, sprite.height], [RING_LEN, lines.length * 2])
const table = parseTable(sprite.data, sprite.width, sprite.height)
check('the sprite parses into the table', table.frames.length, lines.length)

let thin = 0
for (let i = 0; i < table.frames.length; i++) {
  let total = 0
  for (let k = 0; k < RING_LEN; k++) total += table.weights[i * RING_LEN + k]!
  if (total < RING_LEN * 255 * 0.05) thin++
}
check('every frame has border to compare on', thin, 0)

// ------------------------------------------------------------- real cards

section('real cards')

const expected = JSON.parse(readFileSync('app/assets/cardgen/test-cards/frames.json', 'utf8')) as Record<string, string>
check('there are real cards to check against', Object.keys(expected).length >= 5, true)

/** What the browser hands the matcher: the card over white, at card size. */
function flattenedCard(file: string) {
  const png = decodePng(readFileSync(`app/assets/cardgen/test-cards/${file}`))
  const out = new Uint8ClampedArray(CARD.w * CARD.h * 4)
  for (let y = 0; y < CARD.h; y++) {
    for (let x = 0; x < CARD.w; x++) {
      const sx = Math.floor(x * png.width / CARD.w)
      const sy = Math.floor(y * png.height / CARD.h)
      const i = (sy * png.width + sx) * 4
      const a = png.data[i + 3]! / 255
      const o = (y * CARD.w + x) * 4
      out[o] = png.data[i]! * a + 255 * (1 - a)
      out[o + 1] = png.data[i + 1]! * a + 255 * (1 - a)
      out[o + 2] = png.data[i + 2]! * a + 255 * (1 - a)
      out[o + 3] = 255
    }
  }
  return out
}

let worstMargin = 1
let worstUnknown = 0
let scanRight = 0
const scanWrong: string[] = []
const scanMissed: string[] = []
for (const [file, frame] of Object.entries(expected)) {
  const pixels = flattenedCard(file)
  const print = cardPrint(pixels, CARD.w, CARD.h)
  const ranked = rankPrint(print, table)
  const match = acceptMatch(ranked)
  check(`${file} is recognised as ${frame}`, match?.id, frame)
  if (!match) continue

  const rival = ranked.slice(1).find(r => r.redactions.some((b, i) =>
    Math.abs(b.x - match.redactions[i]!.x) > 6 || Math.abs(b.y - match.redactions[i]!.y) > 6))
  if (rival) worstMargin = Math.min(worstMargin, match.score - rival.score)

  // The plates must land where a code and an edition number sit.
  const [top, bottom] = match.redactions as [typeof match.redactions[0], typeof match.redactions[0]]
  check(`${file}: code plate is in the top band`, top.y >= 0 && top.y + top.h <= CARD.h * 0.2, true)
  check(`${file}: numbers plate is in the bottom band`, bottom.y >= CARD.h * 0.8 && bottom.y + bottom.h <= CARD.h, true)

  // With its own frame gone, the card must be turned away rather than given
  // somebody else's plates.
  const without = dropFrames(table, f => f.id === frame)
  const stranger = rankPrint(print, without)
  check(`${file} with its frame missing is not mis-matched`, acceptMatch(stranger)?.id, undefined)
  worstUnknown = Math.max(worstUnknown, stranger[0]!.score - (stranger.find(r => r.redactions.some((b, i) =>
    Math.abs(b.x - stranger[0]!.redactions[i]!.x) > 6 || Math.abs(b.y - stranger[0]!.redactions[i]!.y) > 6))?.score ?? 0))

  // The pixel scan is the fallback for exactly that case. It used to box the
  // transparent margin, or a dark border, as one enormous pill. It is a
  // heuristic and the editor warns to check its boxes, so it is held to a
  // total rather than to every card: a plate on a dark border strip merges
  // into the strip, and nothing short of knowing the frame can split them.
  const pills = detectPills(pixels)
  const onPlate = (box: typeof top | undefined, plate: typeof top) => Boolean(box
    && box.x <= plate.x + plate.w / 2 && box.x + box.w >= plate.x + plate.w / 2
    && box.y <= plate.y + plate.h / 2 && box.y + box.h >= plate.y + plate.h / 2
    && box.w < CARD.w * 0.6)
  for (const [box, plate, which] of [[pills.top, top, 'top'], [pills.bottom, bottom, 'bottom']] as const) {
    if (!box) scanMissed.push(`${file} ${which}`)
    else if (onPlate(box, plate)) scanRight++
    else scanWrong.push(`${file} ${which}`)
  }
}
console.log(`  known frames lead their nearest rival by at least ${worstMargin.toFixed(2)}; an unknown frame's best wrong answer leads by at most ${worstUnknown.toFixed(2)}`)
check('the accept margin sits between those', worstUnknown < 0.12 && worstMargin >= 0.12, true)
const plateCount = Object.keys(expected).length * 2
check('the fallback scan finds most plates on real cards', scanRight >= plateCount * 0.7, true)
check('the fallback scan rarely boxes the wrong thing', scanWrong.length <= plateCount * 0.15, true)
console.log(`  the scan found ${scanRight} of ${plateCount} plates`
  + (scanMissed.length ? `, missed ${scanMissed.join(', ')}` : '')
  + (scanWrong.length ? `, boxed something else on ${scanWrong.join(', ')}` : ''))

console.log(fails ? `\n${fails} check(s) FAILED in ${suite}` : '\nall checks passed')
process.exit(fails ? 1 : 0)
