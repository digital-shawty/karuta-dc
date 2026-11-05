// All of the generator's state, in one store shared by every step.
//
// A module-level singleton rather than `useState`, because the scene holds
// Blobs and decoded images that cannot be serialised. It also means stepping
// back to the setup screen, or navigating away and returning, keeps the work.
//
// Assets are marked raw. Vue would otherwise wrap each one in a deep proxy,
// and a proxied Blob is a good way to get a confusing failure much later. Any
// edit therefore replaces a whole card object instead of mutating one.

import { markRaw } from 'vue'
import {
  chooseSave, matchupFileName, renderToBlob, winnersFileName, zipBlobs, zipFileName,
} from '~/utils/cardgen/export'
import {
  IMAGE_FORMATS, isImageFile, readImageAsset, released, revokeAsset,
} from '~/utils/cardgen/images'
import { buildScene, cardCount, groupSizes, redealCards, slotCount } from '~/utils/cardgen/presets'
import { refineByReading, toCardImage, wantsOcr } from '~/utils/cardgen/redact'
import type {
  CardImage, ImageAsset, Matchup, MatchupSize, Mode, Scene, TeamSize,
} from '~/utils/cardgen/types'

export type Step = 'setup' | 'build'

/**
 * Where a card sits, for dragging.
 * The draft and the winners row are places of their own; anything else is a
 * committed matchup, named by its id.
 */
export const DRAFT = 'draft'
export const WINNERS = 'winners'

/**
 * What a card drag puts on the clipboard.
 * Its own type rather than text, so a slot can tell a card being moved from a
 * file being dropped in without reading the payload, which the browser only
 * allows once the drop has happened.
 */
export const CARD_MIME = 'application/x-cardgen-slot'

interface Draft {
  id: string
  size: MatchupSize
  cards: (CardImage | undefined)[]
  /** Set when the drawer is editing an existing matchup rather than a new one. */
  editing: boolean
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10)
}

function createStore() {
  const step = ref<Step>('setup')

  const background = ref<ImageAsset | undefined>()
  const mode = ref<Mode>('versus')
  const teamSize = ref<TeamSize>('singles')

  const winnersCards = ref<(CardImage | undefined)[]>([])
  const matchups = ref<Matchup[]>([])
  const draft = ref<Draft | null>(null)

  const busy = ref(false)
  const progress = ref('')
  const error = ref('')

  // ------------------------------------------------------------------ toast
  //
  // A step's `error` is for something that went wrong with work already
  // under way, and it stays on screen until the next attempt. Picking the
  // wrong kind of file is not that: nothing has happened yet, and the only
  // useful reply is immediate and brief. So it goes to a toast that takes
  // itself away again.

  const toast = ref('')
  const TOAST_MS = 5000
  let toastTimer: ReturnType<typeof setTimeout> | undefined

  function flash(message: string) {
    toast.value = message
    clearTimeout(toastTimer)
    toastTimer = setTimeout(dismissToast, TOAST_MS)
  }

  function dismissToast() {
    clearTimeout(toastTimer)
    toast.value = ''
  }

  const NOT_AN_IMAGE = `Please insert valid image file (${IMAGE_FORMATS})`

  /**
   * Gate every file on its way in. Guarding here rather than at each picker
   * means a file is checked the same way however it arrived: chosen from the
   * dialog, dropped on a slot, or dropped on the background.
   */
  function accepts(file: Blob): boolean {
    if (isImageFile(file)) return true
    flash(NOT_AN_IMAGE)
    return false
  }

  // ---------------------------------------------------------------- helpers

  async function toCard(file: Blob): Promise<CardImage> {
    const asset = await readImageAsset(file)
    const img = new Image()
    img.src = asset.src
    await img.decode()
    const card = markRaw(await toCardImage(asset, img))
    if (wantsOcr(card)) refineLater(card)
    return card
  }

  /**
   * Swap a card for a better-masked version of itself, wherever it is held.
   *
   * Reading the text takes seconds, so the card goes on screen with rough
   * boxes first and is quietly upgraded when the result arrives. By then it
   * may have been moved, duplicated into a committed matchup, or adjusted by
   * hand, so every copy is found by its source and a hand edit is left alone.
   */
  function swapCard(src: string, better: CardImage) {
    const upgrade = (card: CardImage | undefined) =>
      card && card.src === src && card.detect !== 'manual' ? better : card

    winnersCards.value = winnersCards.value.map(upgrade)
    matchups.value = matchups.value.map(m => ({ ...m, cards: m.cards.map(upgrade) }))
    if (draft.value) draft.value = { ...draft.value, cards: draft.value.cards.map(upgrade) }
  }

  /** Kick off a read of the card's text, without holding up the upload. */
  function refineLater(card: CardImage) {
    void (async () => {
      try {
        const img = new Image()
        img.src = card.src
        await img.decode()
        const better = await refineByReading(card, img)
        if (better) swapCard(card.src, markRaw(better))
      }
      catch (problem) {
        console.warn('cc-gen: could not refine the mask', problem)
      }
    })()
  }

  function sceneFor(size: MatchupSize, cards: (CardImage | undefined)[]): Scene | null {
    if (!background.value) return null
    return buildScene(
      { background: background.value, mode: mode.value, teamSize: teamSize.value },
      size,
      cards,
    )
  }

  // ------------------------------------------------------------------ setup

  /**
   * Take a new background.
   * Matchups are untouched: they hold cards, not the backdrop, and the whole
   * point of swapping it on the build screen is to keep the work.
   */
  async function setBackground(file: Blob) {
    if (!accepts(file)) return
    error.value = ''
    try {
      const next = markRaw(await readImageAsset(file))
      revokeAsset(background.value)
      background.value = next
    }
    catch {
      error.value = 'That file could not be read as an image.'
    }
  }

  /** Winners always has three places, so its row is sized by team size alone. */
  function resizeWinners() {
    const want = slotCount('winners', teamSize.value, 'pair')
    const next = winnersCards.value.slice(0, want)
    while (next.length < want) next.push(undefined)
    winnersCards.value = next
  }

  function setMode(next: Mode) {
    mode.value = next
  }

  /**
   * Team size changes how many cards a matchup holds, so anything already
   * built no longer fits. Versus work is dropped; the winners row is resized.
   */
  function setTeamSize(next: TeamSize) {
    if (next === teamSize.value) return
    teamSize.value = next
    clearMatchups()
    draft.value = null
    resizeWinners()
  }

  const canAdvance = computed(() => Boolean(background.value))

  function next() {
    if (!canAdvance.value) return
    resizeWinners()
    step.value = 'build'
  }

  function back() {
    step.value = 'setup'
  }

  // ---------------------------------------------------------------- winners

  async function setWinnersCard(index: number, file: Blob) {
    if (!accepts(file)) return
    error.value = ''
    try {
      const card = await toCard(file)
      const next = winnersCards.value.slice()
      revokeAsset(next[index])
      next[index] = card
      winnersCards.value = next
    }
    catch {
      error.value = 'That card could not be read as an image.'
    }
  }

  function updateWinnersCard(index: number, card: CardImage) {
    const next = winnersCards.value.slice()
    next[index] = markRaw(card)
    winnersCards.value = next
  }

  function clearWinnersCard(index: number) {
    const next = winnersCards.value.slice()
    revokeAsset(next[index])
    next[index] = undefined
    winnersCards.value = next
  }

  const winnersScene = computed(() => sceneFor('pair', winnersCards.value))
  const winnersReady = computed(() =>
    winnersCards.value.length > 0 && winnersCards.value.every(Boolean))

  async function downloadWinners() {
    const scene = winnersScene.value
    if (!scene || !winnersReady.value || busy.value) return

    // Asked before rendering: the dialog needs a recent click to open.
    const target = await chooseSave(winnersFileName(), 'png')
    if (!target) return

    busy.value = true
    error.value = ''
    try {
      await target.write(await renderToBlob(scene))
    }
    catch {
      error.value = 'The image could not be generated.'
    }
    finally {
      busy.value = false
    }
  }

  // ----------------------------------------------------------------- versus

  function startDraft(size: MatchupSize) {
    // Starting a new one abandons whatever was half-built, so release it first.
    cancelDraft()
    const count = cardCount(teamSize.value, size)
    draft.value = {
      id: makeId(),
      size,
      cards: Array.from({ length: count }, () => undefined),
      editing: false,
    }
  }

  function editMatchup(id: string) {
    const found = matchups.value.find(m => m.id === id)
    if (!found) return
    draft.value = { id, size: found.size, cards: found.cards.slice(), editing: true }
  }

  async function setDraftCard(index: number, file: Blob) {
    if (!draft.value) return
    if (!accepts(file)) return
    error.value = ''
    try {
      const card = await toCard(file)
      const cards = draft.value.cards.slice()
      // Release whatever was here, unless the committed matchup still holds
      // it. During an edit the originals belong to the gallery entry until
      // the edit is confirmed, and a swap may have moved this one to another
      // slot, so what the matchup holds is asked as a set.
      const previous = cards[index]
      for (const old of released([previous], ownerCards())) revokeAsset(old)
      cards[index] = card
      draft.value = { ...draft.value, cards }
    }
    catch {
      error.value = 'That card could not be read as an image.'
    }
  }

  /**
   * What the gallery entry behind an open edit still holds.
   * Empty for a new matchup, which owns nothing yet, so everything in it is
   * the draft's to release.
   */
  function ownerCards(): (CardImage | undefined)[] {
    if (!draft.value?.editing) return []
    return matchups.value.find(m => m.id === draft.value!.id)?.cards ?? []
  }

  function updateDraftCard(index: number, card: CardImage) {
    if (!draft.value) return
    const cards = draft.value.cards.slice()
    cards[index] = markRaw(card)
    draft.value = { ...draft.value, cards }
  }

  function clearDraftCard(index: number) {
    if (!draft.value) return
    const cards = draft.value.cards.slice()
    for (const old of released([cards[index]], ownerCards())) revokeAsset(old)
    cards[index] = undefined
    draft.value = { ...draft.value, cards }
  }

  function cancelDraft() {
    const current = draft.value
    if (current) {
      // Drop anything the draft brought with it. During an edit that means
      // only cards added since it opened; the gallery entry still holds the
      // originals, wherever a swap has since moved them.
      for (const card of released(current.cards, ownerCards())) revokeAsset(card)
    }
    draft.value = null
  }

  const draftReady = computed(() =>
    Boolean(draft.value) && draft.value!.cards.every(Boolean))

  const draftScene = computed(() =>
    draft.value ? sceneFor(draft.value.size, draft.value.cards) : null)

  function commitDraft() {
    const current = draft.value
    if (!current || !draftReady.value) return

    const entry: Matchup = { id: current.id, size: current.size, cards: current.cards.slice() }
    const at = matchups.value.findIndex(m => m.id === current.id)

    if (at >= 0) {
      const next = matchups.value.slice()
      // Drop only the cards the edit actually dropped. A card the edit moved
      // to another slot is still in the matchup and must keep its URL.
      for (const old of released(next[at]!.cards, entry.cards)) revokeAsset(old)
      next[at] = entry
      matchups.value = next
    }
    else {
      matchups.value = [...matchups.value, entry]
    }
    draft.value = null
  }

  function removeMatchup(id: string) {
    const found = matchups.value.find(m => m.id === id)
    if (!found) return
    // An open edit of this matchup holds references of its own. Dropped
    // first, while the matchup is still here to say which of them it owns.
    if (draft.value?.id === id) cancelDraft()
    for (const card of found.cards) revokeAsset(card)
    matchups.value = matchups.value.filter(m => m.id !== id)
  }

  function clearMatchups() {
    for (const entry of matchups.value) {
      for (const card of entry.cards) revokeAsset(card)
    }
    matchups.value = []
  }

  /** Throw away every matchup, and whatever was being built with them. */
  function clearAll() {
    cancelDraft()
    clearMatchups()
  }

  // ------------------------------------------------------------------ multi
  //
  // One pile of files in, a gallery of matchups out. Trios are used only
  // where pairs will not divide the pile evenly, and whatever is left over
  // opens as a half-filled pair rather than being dropped on the floor. One
  // card on its own is the smallest case of exactly that.

  async function addMulti(files: Iterable<File>) {
    const all = [...files]
    const picked = all.filter(isImageFile)
    // One toast for the batch, however many of them were not images.
    if (picked.length < all.length) flash(NOT_AN_IMAGE)
    if (!picked.length || busy.value) return

    busy.value = true
    error.value = ''
    try {
      const cards: CardImage[] = []
      for (const [i, file] of picked.entries()) {
        progress.value = `Reading ${i + 1} of ${picked.length}`
        cards.push(await toCard(file))
      }

      const { sizes, leftover } = groupSizes(teamSize.value, cards.length)
      const added: Matchup[] = []
      let at = 0
      for (const size of sizes) {
        const count = cardCount(teamSize.value, size)
        added.push({ id: makeId(), size, cards: cards.slice(at, at + count) })
        at += count
      }
      matchups.value = [...matchups.value, ...added]

      if (leftover > 0) {
        cancelDraft()
        const rest = cards.slice(at)
        const count = cardCount(teamSize.value, 'pair')
        draft.value = {
          id: makeId(),
          size: 'pair',
          editing: false,
          cards: Array.from({ length: count }, (_, i) => rest[i]),
        }
      }
    }
    catch {
      error.value = 'Those cards could not all be read as images.'
    }
    finally {
      busy.value = false
      progress.value = ''
    }
  }

  /**
   * Redraw every matchup.
   *
   * Every card already added goes back into one pile, is shuffled, and is
   * dealt out across the gallery again, so who faces whom is decided afresh.
   * The shapes are kept: a trio is still a trio, and the chips stay where
   * they are, since it is their contents that changed.
   */
  function shuffleMatchups() {
    if (!matchups.value.length) return

    // An open edit holds its own copy of a matchup that is about to change,
    // and would write those stale cards back over the deal when confirmed.
    // Dropped first, while what it owns still lines up with the gallery.
    if (draft.value?.editing) cancelDraft()

    const dealt = redealCards(matchups.value.map(entry => entry.cards))
    matchups.value = matchups.value.map((entry, i) => ({ ...entry, cards: dealt[i]! }))
  }

  // ------------------------------------------------------------- reordering
  //
  // Cards are moved by dragging one onto another, which swaps the two. While
  // a drag is over a slot both ends show what they are about to become.
  //
  // Swaps stay inside one place: within the draft, or between committed
  // matchups. Carrying a card across that line would mean deciding who owns
  // it halfway through an edit, and the answer is never worth the bug.

  interface Slot { scope: string, index: number }

  const dragFrom = ref<Slot | null>(null)
  const dragOver = ref<Slot | null>(null)

  function cardAt(slot: Slot | null): CardImage | undefined {
    if (!slot) return undefined
    if (slot.scope === DRAFT) return draft.value?.cards[slot.index]
    if (slot.scope === WINNERS) return winnersCards.value[slot.index]
    return matchups.value.find(m => m.id === slot.scope)?.cards[slot.index]
  }

  function canSwap(from: Slot | null, to: Slot): boolean {
    if (!from) return false
    if (from.scope === to.scope && from.index === to.index) return false
    // The draft and the winners row only trade with themselves.
    const own = (scope: string) => scope === DRAFT || scope === WINNERS
    if (own(from.scope) || own(to.scope)) return from.scope === to.scope
    // The chip being edited is showing cards the drawer also holds; moving
    // them here would be overwritten the moment the edit is confirmed.
    const open = draft.value?.editing ? draft.value.id : null
    if (open && (from.scope === open || to.scope === open)) return false
    return true
  }

  function beginDrag(scope: string, index: number) {
    dragFrom.value = { scope, index }
    dragOver.value = null
  }

  function hoverSlot(scope: string, index: number) {
    const current = dragOver.value
    if (current && current.scope === scope && current.index === index) return
    if (!canSwap(dragFrom.value, { scope, index })) return
    dragOver.value = { scope, index }
  }

  function leaveSlot(scope: string, index: number) {
    const current = dragOver.value
    if (current && current.scope === scope && current.index === index) dragOver.value = null
  }

  function endDrag() {
    dragFrom.value = null
    dragOver.value = null
  }

  /** The card a slot is about to receive, for the half-faded preview. */
  function pendingAt(scope: string, index: number): CardImage | undefined {
    const from = dragFrom.value
    const to = dragOver.value
    if (!from || !to) return undefined
    if (to.scope === scope && to.index === index) return cardAt(from)
    if (from.scope === scope && from.index === index) return cardAt(to)
    return undefined
  }

  function dropOn(scope: string, index: number) {
    const from = dragFrom.value
    const to = { scope, index }
    endDrag()
    if (!canSwap(from, to) || !from) return

    if (from.scope === DRAFT) {
      if (!draft.value) return
      const cards = draft.value.cards.slice()
      const held = cards[from.index]
      cards[from.index] = cards[to.index]
      cards[to.index] = held
      draft.value = { ...draft.value, cards }
      return
    }

    if (from.scope === WINNERS) {
      const cards = winnersCards.value.slice()
      const held = cards[from.index]
      cards[from.index] = cards[to.index]
      cards[to.index] = held
      winnersCards.value = cards
      return
    }

    // Both ends are committed matchups, which may be the same one. Rebuilding
    // from the originals keeps a swap within one matchup from reading a value
    // it has already overwritten.
    const held = cardAt(from)
    const landing = cardAt(to)
    matchups.value = matchups.value.map((entry) => {
      if (entry.id !== from.scope && entry.id !== to.scope) return entry
      const cards = entry.cards.slice()
      if (entry.id === from.scope) cards[from.index] = landing
      if (entry.id === to.scope) cards[to.index] = held
      return { ...entry, cards }
    })
  }

  // --------------------------------------------------------------- download

  /** The matchup backing a gallery chip, for its thumbnails. */
  function sceneForMatchup(entry: Matchup): Scene | null {
    return sceneFor(entry.size, entry.cards)
  }

  const versusReady = computed(() => matchups.value.length > 0)

  /** Save one matchup on its own, from its chip. */
  async function downloadMatchup(id: string) {
    const at = matchups.value.findIndex(m => m.id === id)
    const entry = matchups.value[at]
    if (!entry || busy.value) return

    const target = await chooseSave(matchupFileName(at, entry.size), 'png')
    if (!target) return

    busy.value = true
    error.value = ''
    try {
      const scene = sceneForMatchup(entry)
      if (scene) await target.write(await renderToBlob(scene))
    }
    catch {
      error.value = 'The image could not be generated.'
    }
    finally {
      busy.value = false
    }
  }

  /**
   * Save the gallery.
   * One matchup is one PNG; there is nothing to bundle, and an archive
   * holding a single file is just an extra step before seeing it.
   */
  async function downloadMatchups() {
    if (!versusReady.value || busy.value) return

    const entries = matchups.value
    const single = entries.length === 1 ? entries[0]! : undefined
    const target = single
      ? await chooseSave(matchupFileName(0, single.size), 'png')
      : await chooseSave(zipFileName(), 'zip')
    if (!target) return

    busy.value = true
    error.value = ''
    try {
      if (single) {
        const scene = sceneForMatchup(single)
        if (scene) await target.write(await renderToBlob(scene))
      }
      else {
        const files: { name: string, blob: Blob }[] = []
        for (const [i, entry] of entries.entries()) {
          progress.value = `Rendering ${i + 1} of ${entries.length}`
          const scene = sceneForMatchup(entry)
          if (!scene) continue
          files.push({ name: matchupFileName(i, entry.size), blob: await renderToBlob(scene) })
        }
        progress.value = 'Packing the archive'
        await target.write(await zipBlobs(files))
      }
    }
    catch {
      error.value = 'The download could not be generated.'
    }
    finally {
      busy.value = false
      progress.value = ''
    }
  }

  return {
    step,
    background,
    mode,
    teamSize,
    winnersCards,
    matchups,
    draft,
    busy,
    progress,
    error,
    toast,
    dismissToast,
    canAdvance,
    winnersScene,
    winnersReady,
    draftScene,
    draftReady,
    versusReady,
    dragFrom,
    setBackground,
    setMode,
    setTeamSize,
    next,
    back,
    setWinnersCard,
    updateWinnersCard,
    clearWinnersCard,
    downloadWinners,
    startDraft,
    editMatchup,
    setDraftCard,
    updateDraftCard,
    clearDraftCard,
    cancelDraft,
    commitDraft,
    removeMatchup,
    clearAll,
    addMulti,
    shuffleMatchups,
    beginDrag,
    hoverSlot,
    leaveSlot,
    endDrag,
    pendingAt,
    dropOn,
    sceneForMatchup,
    downloadMatchup,
    downloadMatchups,
  }
}

let store: ReturnType<typeof createStore> | undefined

export function useCardgen() {
  return (store ??= createStore())
}
