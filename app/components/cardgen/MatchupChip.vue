<script setup>
// One finished matchup in the gallery: its cards in order, with edit, save
// and remove underneath. Thumbnails rather than a rendered composite, because
// a chip only needs to say which matchup it is.
//
// The thumbnails are also handles. Drag one onto another card, in this chip
// or any other, to swap the two. While a swap is lined up both ends show
// what they are about to hold, half faded. Clicking one without dragging
// opens the matchup for editing, the same as the pencil below it: the cards
// are the obvious thing to reach for, and they are a far bigger target.

import { CARD_MIME } from '~/composables/useCardgen'

const props = defineProps({
  matchup: { type: Object, required: true },
  active: { type: Boolean, default: false },
})

const emit = defineEmits(['edit', 'remove', 'download'])

const gen = useCardgen()

function shown(index) {
  return gen.pendingAt(props.matchup.id, index) ?? props.matchup.cards[index]
}

function isPending(index) {
  return Boolean(gen.pendingAt(props.matchup.id, index))
}

/**
 * Whether the gesture under way is a drag.
 *
 * A finished drag does not raise a click, so this is belt and braces rather
 * than the whole of it, and it is plain state rather than a ref because
 * nothing renders from it.
 */
let dragging = false

function onDragStart(event, index) {
  dragging = true
  event.dataTransfer.setData(CARD_MIME, `${props.matchup.id}:${index}`)
  event.dataTransfer.effectAllowed = 'move'
  gen.beginDrag(props.matchup.id, index)
}

function onOpen() {
  // Already open in the builder: asking for it again would rebuild the draft
  // from the filed cards and throw away whatever has been changed there.
  if (dragging || props.active) return
  emit('edit')
}

function onDragOver(event, index) {
  if (![...(event.dataTransfer?.types ?? [])].includes(CARD_MIME)) return
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  gen.hoverSlot(props.matchup.id, index)
}
</script>

<template>
  <div class="flex flex-col items-center gap-1.5">
    <div
      class="flex gap-1.5 rounded-lg border-2 bg-surface p-2 transition-colors"
      :class="active ? 'border-accent' : 'border-line'"
    >
      <img
        v-for="(card, index) in matchup.cards"
        :key="index"
        :src="shown(index)?.src"
        alt=""
        draggable="true"
        :title="active ? '' : 'Click to edit, or drag to swap'"
        class="h-[5.25rem] w-[3.55rem] cursor-grab rounded-sm object-cover transition-opacity active:cursor-grabbing"
        :class="isPending(index) && 'opacity-50 outline outline-2 outline-dashed outline-accent'"
        @pointerdown="dragging = false"
        @click="onOpen"
        @dragstart="onDragStart($event, index)"
        @dragend="gen.endDrag"
        @dragover="onDragOver($event, index)"
        @dragleave="gen.leaveSlot(matchup.id, index)"
        @drop.prevent="gen.dropOn(matchup.id, index)"
      >
    </div>

    <div class="flex gap-1.5">
      <button
        type="button"
        aria-label="Edit matchup"
        class="grid size-7 place-items-center rounded-md transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
        :class="active ? 'text-accent' : 'text-ink'"
        @click="emit('edit')"
      >
        <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11.5 2.5l2 2L6 12l-3 1 1-3z" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Download this matchup"
        class="grid size-7 place-items-center rounded-md text-ink transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
        @click="emit('download')"
      >
        <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 2.5v7.5M4.75 7l3.25 3 3.25-3M3 13h10" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Remove matchup"
        class="grid size-7 place-items-center rounded-md bg-danger-soft text-danger transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-danger"
        @click="emit('remove')"
      >
        <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M4 8h8" />
        </svg>
      </button>
    </div>
  </div>
</template>
