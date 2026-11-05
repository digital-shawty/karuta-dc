<script setup>
// One card slot in a form: browse, drop, or open the filled card for editing.
// Reads "Browse or drag image here" when empty and "Edit image" once filled,
// which is the wireframe's wording and also what the click does.
//
// A filled field is also a handle: drag its thumbnail onto another field to
// swap the two cards. Give it a `scope` to turn that on. While a swap is
// lined up both fields show what they are about to hold, half faded.

import { CARD_MIME } from '~/composables/useCardgen'

const props = defineProps({
  card: { type: Object, default: null },
  label: { type: String, default: '' },
  /** Which collection this field belongs to. Omit to leave dragging off. */
  scope: { type: String, default: '' },
  index: { type: Number, default: 0 },
})

const emit = defineEmits(['file', 'edit', 'clear'])

const gen = useCardgen()
const input = ref(null)
const over = ref(false)

const pending = computed(() =>
  props.scope ? gen.pendingAt(props.scope, props.index) : undefined)

const shown = computed(() => pending.value ?? props.card)

function activate() {
  if (props.card) emit('edit')
  else input.value?.click()
}

function onPick(event) {
  const file = event.target.files?.[0]
  if (file) emit('file', file)
  // Let the same file be picked again after a clear.
  event.target.value = ''
}

/** True while the thing being dragged is one of our own cards. */
function isCard(event) {
  return [...(event.dataTransfer?.types ?? [])].includes(CARD_MIME)
}

function onDragStart(event) {
  if (!props.scope || !props.card) return
  event.dataTransfer.setData(CARD_MIME, `${props.scope}:${props.index}`)
  event.dataTransfer.effectAllowed = 'move'
  gen.beginDrag(props.scope, props.index)
}

function onDragOver(event) {
  if (isCard(event)) {
    if (!props.scope) return
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    gen.hoverSlot(props.scope, props.index)
    return
  }
  event.preventDefault()
  over.value = true
}

function onDragLeave() {
  over.value = false
  if (props.scope) gen.leaveSlot(props.scope, props.index)
}

function onDrop(event) {
  over.value = false
  if (isCard(event)) {
    if (props.scope) gen.dropOn(props.scope, props.index)
    return
  }
  // Not sifted for an image here: the store vets files, and dropping the
  // wrong one should say so rather than quietly do nothing.
  const file = event.dataTransfer?.files?.[0]
  if (file) emit('file', file)
}
</script>

<template>
  <div class="flex min-w-0 flex-col gap-1.5">
    <p v-if="label" class="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
      {{ label }}
    </p>

    <div class="relative">
      <button
        type="button"
        class="flex h-11 w-full items-center gap-2 rounded-lg border px-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        :class="[
          card ? 'border-solid border-line bg-surface' : 'border-2 border-dashed border-line/80 bg-surface/60',
          (over || pending) && 'border-accent bg-accent/5',
          card && 'pr-8',
        ]"
        @click="activate"
        @dragover.prevent="onDragOver"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop"
      >
        <img
          v-if="shown"
          :src="shown.src"
          alt=""
          class="size-7 shrink-0 rounded-sm object-cover"
          :class="[pending && 'opacity-50', scope && card && 'cursor-grab active:cursor-grabbing']"
          :draggable="Boolean(scope && card)"
          @dragstart="onDragStart"
          @dragend="gen.endDrag"
          @click.stop="activate"
        >
        <span class="min-w-0 flex-1 truncate" :class="card ? 'text-ink' : 'text-muted'">
          {{ card ? 'Edit image' : 'Browse or drag image here' }}
        </span>
      </button>

      <button
        v-if="card"
        type="button"
        aria-label="Remove image"
        class="absolute right-1.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
        @click.stop="emit('clear')"
      >
        <svg viewBox="0 0 16 16" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>

      <input
        ref="input"
        type="file"
        accept="image/*"
        class="sr-only"
        @change="onPick"
      >
    </div>
  </div>
</template>
