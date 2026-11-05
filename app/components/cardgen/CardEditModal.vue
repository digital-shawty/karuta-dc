<script setup>
// The one place anything is dragged.
//
// Shows a card at a workable size with its two black boxes on top, so a code
// the scanner placed slightly wrong can be nudged. Boxes are stored in card
// space, a fixed 274 x 405 grid over whatever the image measures, so they are
// positioned here as percentages and need no pixel maths to render. Pixels
// only come into it when converting a drag, which is why the frame's measured
// width is read at the start of each gesture.
import { clampRect, defaultRedactions } from '~/utils/cardgen/redact'
import { CARD } from '~/utils/cardgen/types'

const props = defineProps({
  card: { type: Object, required: true },
})

const emit = defineEmits(['update', 'replace', 'close'])

const rects = ref(props.card.redactions.map(r => ({ ...r })))

// Replacing the image swaps in a freshly scanned card. Without this the modal
// would keep showing the previous card's boxes, and the next drag would commit
// them onto the new image.
watch(() => props.card, card => {
  rects.value = card.redactions.map(r => ({ ...r }))
})
const frame = ref(null)
const input = ref(null)
const showBoxes = ref(true)

// Where the current boxes came from, in plain words. A frame match is exact;
// anything else is worth a glance before the card goes out.
const placed = computed(() => {
  switch (props.card.detect) {
    case 'frame':
      return { label: `Matched the ${props.card.frame} frame, so these are its exact plates.`, warn: false }
    case 'ocr':
      return { label: 'This frame is new, so the code was found by reading it.', warn: false }
    case 'manual':
      return { label: 'You placed these by hand.', warn: false }
    case 'pixel':
      return { label: 'This frame is new. The dark bars were found by scanning, so check them.', warn: true }
    default:
      return { label: 'Nothing was recognised, so these sit where codes usually are. Check them.', warn: true }
  }
})

// The gesture in progress, or null. `unit` is card-space units per CSS pixel.
let drag = null

function pct(value, total) {
  return `${(value / total) * 100}%`
}

function boxStyle(rect) {
  return {
    left: pct(rect.x, CARD.w),
    top: pct(rect.y, CARD.h),
    width: pct(rect.w, CARD.w),
    height: pct(rect.h, CARD.h),
  }
}

function start(event, index, mode) {
  const box = frame.value?.getBoundingClientRect()
  if (!box?.width) return

  event.preventDefault()
  event.currentTarget.setPointerCapture?.(event.pointerId)
  drag = {
    index,
    mode,
    x: event.clientX,
    y: event.clientY,
    from: { ...rects.value[index] },
    unit: CARD.w / box.width,
  }
}

function move(event) {
  if (!drag) return
  const dx = (event.clientX - drag.x) * drag.unit
  const dy = (event.clientY - drag.y) * drag.unit
  const from = drag.from

  const next = drag.mode === 'move'
    ? { ...from, x: from.x + dx, y: from.y + dy }
    : { ...from, w: from.w + dx, h: from.h + dy }

  const copy = rects.value.slice()
  copy[drag.index] = clampRect(next)
  rects.value = copy
}

function end() {
  if (!drag) return
  drag = null
  commit()
}

function commit() {
  // Moving a box by hand replaces the frame's own outline with it. Keeping
  // both would mean painting the old shape underneath whatever was just moved.
  emit('update', {
    ...props.card,
    redactions: rects.value.map(r => ({ ...r })),
    mask: undefined,
    detect: 'manual',
  })
}

function reset() {
  rects.value = defaultRedactions()
  commit()
}

function onPick(event) {
  const file = event.target.files?.[0]
  if (file) emit('replace', file)
  event.target.value = ''
}

function onKey(event) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    class="fixed inset-0 z-50 grid place-items-center bg-canvas/80 p-4"
    @pointerdown.self="emit('close')"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit card"
      class="flex max-h-full w-full max-w-md flex-col gap-4 overflow-y-auto rounded-xl bg-surface p-6 text-ink"
    >
      <div>
        <h2 class="text-base font-semibold">Cover the code</h2>
        <p class="mt-1 text-xs text-muted">
          Drag a box to move it, or its corner to resize. Both boxes are
          included in the download whether or not they are shown here.
        </p>
        <p class="mt-1.5 text-xs" :class="placed.warn ? 'text-danger' : 'text-muted'">
          {{ placed.label }}
        </p>
      </div>

      <div
        ref="frame"
        class="relative mx-auto w-full max-w-[18rem] touch-none select-none overflow-hidden rounded-lg border border-line"
        @pointermove="move"
        @pointerup="end"
        @pointercancel="end"
      >
        <img :src="card.src" alt="" class="block w-full" draggable="false">

        <template v-if="showBoxes">
          <div
            v-for="(rect, index) in rects"
            :key="index"
            class="absolute cursor-move bg-black outline outline-2 outline-offset-[-2px] outline-accent/70"
            :style="boxStyle(rect)"
            @pointerdown="start($event, index, 'move')"
          >
            <span
              class="absolute -bottom-1 -right-1 size-3 cursor-nwse-resize rounded-sm border-2 border-ink bg-accent"
              @pointerdown.stop="start($event, index, 'resize')"
            />
          </div>
        </template>
      </div>

      <label class="flex items-center gap-2 text-xs text-muted">
        <input v-model="showBoxes" type="checkbox" class="size-3.5 accent-[color:var(--color-accent)]">
        Show the boxes
      </label>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="h-9 rounded-lg border border-line px-3 text-xs font-semibold transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @click="input?.click()"
        >
          Replace image
        </button>
        <button
          type="button"
          class="h-9 rounded-lg border border-line px-3 text-xs font-semibold transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @click="reset"
        >
          Reset boxes
        </button>
        <button
          type="button"
          class="ml-auto h-9 rounded-lg bg-accent px-4 text-xs font-semibold text-canvas transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          @click="emit('close')"
        >
          Done
        </button>
      </div>

      <input ref="input" type="file" accept="image/*" class="sr-only" @change="onPick">
    </div>
  </div>
</template>
