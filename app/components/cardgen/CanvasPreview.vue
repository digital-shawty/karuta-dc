<script setup>
// A view of a scene, drawn by the same renderer that produces the downloaded
// file.
//
// The canvas keeps its full export resolution and is only ever scaled down by
// CSS, so the preview is the real thing rather than an approximation.
//
// Given a `scope`, each slot also gets an invisible handle laid over it, so a
// card can be picked up straight off the picture and dropped on another slot
// to swap the two. The handles are positioned as percentages of the canvas,
// which is exactly how the canvas itself is scaled, so they stay registered
// at any size.

import { CARD_MIME } from '~/composables/useCardgen'
import { renderScene } from '~/utils/cardgen/render'
import { CARD } from '~/utils/cardgen/types'

const props = defineProps({
  scene: { type: Object, default: null },
  placeholders: { type: Boolean, default: true },
  /** Which collection these slots belong to. Omit to leave dragging off. */
  scope: { type: String, default: '' },
})

const gen = useCardgen()
const canvas = ref(null)

/** Tallest a drag ghost is drawn, in CSS pixels. */
const GHOST_H = 170

const handles = computed(() => {
  const scene = props.scene
  if (!scene || !props.scope) return []
  return scene.slots.map((slot, index) => ({
    index,
    slot,
    card: scene.cards[index],
    style: {
      left: `${(slot.x / scene.canvas.w) * 100}%`,
      top: `${(slot.y / scene.canvas.h) * 100}%`,
      width: `${((CARD.w * slot.scale) / scene.canvas.w) * 100}%`,
      height: `${((CARD.h * slot.scale) / scene.canvas.h) * 100}%`,
    },
  }))
})

// The preview takes the width it is given, but gives width back rather than
// growing taller than --preview-max-h. Dividing that budget by the scene's
// ratio turns it into the width at which the canvas is exactly that tall.
const box = computed(() => {
  const size = props.scene?.canvas ?? { w: 5, h: 3 }
  return {
    aspectRatio: `${size.w} / ${size.h}`,
    maxWidth: `calc(var(--preview-max-h) * ${size.w} / ${size.h})`,
  }
})

// Draws are queued rather than fired in parallel. Each one awaits image
// decoding, so without a queue a slow earlier draw could land on top of a
// newer one and leave the preview showing stale cards.
let queue = Promise.resolve()

async function paint() {
  const el = canvas.value
  const scene = props.scene
  if (!el || !scene) return

  el.width = scene.canvas.w
  el.height = scene.canvas.h

  const ctx = el.getContext('2d')
  if (!ctx) return
  await renderScene(ctx, scene, { placeholders: props.placeholders })
}

function draw() {
  queue = queue
    .then(paint)
    .catch(error => console.error('cc-gen: preview failed to draw', error))
}

watch(() => props.scene, draw, { deep: true })
onMounted(draw)

// ------------------------------------------------------------------ dragging

/**
 * The picture the cursor carries, cut out of the preview itself.
 *
 * Taken from the canvas rather than from the card file, so it is the masked
 * card: a raw thumbnail would put the code back on screen, which is the one
 * thing this tool exists to prevent. The crop has to be on the page for the
 * browser to use it, so it is parked offscreen and removed when the drag ends.
 */
let ghost = null

function makeGhost(slot) {
  const el = canvas.value
  if (!el) return null

  const sw = Math.round(CARD.w * slot.scale)
  const sh = Math.round(CARD.h * slot.scale)
  const scale = Math.min(1, GHOST_H / sh)

  const crop = document.createElement('canvas')
  crop.width = Math.max(1, Math.round(sw * scale))
  crop.height = Math.max(1, Math.round(sh * scale))

  const ctx = crop.getContext('2d')
  if (!ctx) return null
  ctx.drawImage(el, Math.round(slot.x), Math.round(slot.y), sw, sh, 0, 0, crop.width, crop.height)

  crop.style.cssText = 'position:fixed;top:-1000px;left:-1000px;pointer-events:none'
  document.body.append(crop)
  return crop
}

function dropGhost() {
  ghost?.remove()
  ghost = null
}

function onDragStart(event, handle) {
  if (!handle.card) return
  event.dataTransfer.setData(CARD_MIME, `${props.scope}:${handle.index}`)
  event.dataTransfer.effectAllowed = 'move'

  ghost = makeGhost(handle.slot)
  if (ghost) event.dataTransfer.setDragImage(ghost, ghost.width / 2, ghost.height / 2)

  gen.beginDrag(props.scope, handle.index)
}

function onDragEnd() {
  dropGhost()
  gen.endDrag()
}

function onDragOver(event, index) {
  if (![...(event.dataTransfer?.types ?? [])].includes(CARD_MIME)) return
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  gen.hoverSlot(props.scope, index)
}

function onDrop(index) {
  dropGhost()
  gen.dropOn(props.scope, index)
}

onBeforeUnmount(dropGhost)
</script>

<template>
  <div
    class="relative mx-auto w-full overflow-hidden rounded-xl border border-line bg-surface"
    :style="box"
  >
    <canvas v-show="scene" ref="canvas" class="absolute inset-0 h-full w-full" />

    <div
      v-for="handle in handles"
      :key="handle.index"
      class="absolute rounded-sm transition-colors"
      :class="[
        handle.card ? 'cursor-grab active:cursor-grabbing' : '',
        gen.pendingAt(scope, handle.index) && 'outline outline-2 outline-dashed outline-accent',
      ]"
      :style="handle.style"
      :draggable="Boolean(handle.card)"
      @dragstart="onDragStart($event, handle)"
      @dragend="onDragEnd"
      @dragover="onDragOver($event, handle.index)"
      @dragleave="gen.leaveSlot(scope, handle.index)"
      @drop.prevent="onDrop(handle.index)"
    >
      <!--
        The card this slot is about to receive, over the one the canvas has
        already drawn. Both show through, which is what makes it read as a
        swap rather than a replacement.
      -->
      <img
        v-if="gen.pendingAt(scope, handle.index)"
        :src="gen.pendingAt(scope, handle.index).src"
        alt=""
        draggable="false"
        class="pointer-events-none h-full w-full object-contain opacity-60"
      >
    </div>

    <p
      v-if="!scene"
      class="absolute inset-0 grid place-items-center text-sm text-muted"
    >
      <slot name="empty">Background preview</slot>
    </p>
  </div>
</template>
