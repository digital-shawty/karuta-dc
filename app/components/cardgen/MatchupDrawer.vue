<script setup>
// The panel that fills the spot under the preview while a matchup is being
// built or edited.
//
// In duos the fields are grouped by side, so it stays obvious which two cards
// make up a team rather than leaving four identical boxes in a row.
//
// Cards here can be dragged onto one another to change which seat they take,
// which is the same gesture the gallery uses.

import { DRAFT } from '~/composables/useCardgen'

const props = defineProps({
  draft: { type: Object, required: true },
  teamSize: { type: String, required: true },
})

const emit = defineEmits(['file', 'edit', 'clear', 'commit', 'delete'])

const sides = computed(() => {
  const per = props.teamSize === 'duos' ? 2 : 1
  const count = props.draft.cards.length / per
  return Array.from({ length: count }, (_, side) =>
    Array.from({ length: per }, (_, seat) => side * per + seat))
})

const ready = computed(() => props.draft.cards.every(Boolean))
const verb = computed(() => {
  if (props.draft.editing) return 'Confirm edit'
  return props.draft.size === 'pair' ? 'Add pair' : 'Add trio'
})
</script>

<template>
  <div
    class="flex flex-col gap-3 rounded-lg border-2 bg-canvas/60 p-3"
    :class="draft.editing ? 'border-accent' : 'border-line'"
  >
    <div class="grid gap-3" :class="sides.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'">
      <div v-for="(seats, side) in sides" :key="side" class="flex min-w-0 flex-col gap-2">
        <p v-if="teamSize === 'duos'" class="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted">
          Side {{ side + 1 }}
        </p>
        <CardgenCardField
          v-for="slot in seats"
          :key="slot"
          :card="draft.cards[slot]"
          :scope="DRAFT"
          :index="slot"
          @file="emit('file', slot, $event)"
          @edit="emit('edit', slot)"
          @clear="emit('clear', slot)"
        />
      </div>
    </div>

    <button
      type="button"
      :disabled="!ready"
      class="h-10 rounded-lg text-xs font-semibold uppercase tracking-[0.12em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      :class="ready
        ? 'bg-accent text-canvas hover:opacity-90'
        : 'cursor-not-allowed bg-surface text-muted'"
      @click="emit('commit')"
    >
      {{ verb }}
    </button>

    <button
      type="button"
      class="h-10 rounded-lg border border-danger bg-danger-soft text-xs font-semibold uppercase tracking-[0.12em] text-danger transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
      @click="emit('delete')"
    >
      Delete
    </button>
  </div>
</template>
