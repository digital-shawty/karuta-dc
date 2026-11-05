<script setup>
// Step two in winners mode: one podium image, three places, one download.
//
// Slots come out of the preset in logical order (first, second, third), while
// the fields read left to right as a podium does, so the mapping below is the
// only place that reordering lives.

import { WINNERS } from '~/composables/useCardgen'

const gen = useCardgen()
const editing = ref(null)

const groups = computed(() => {
  const per = gen.teamSize.value === 'duos' ? 2 : 1
  const slotsFor = place => Array.from({ length: per }, (_, k) => place * per + k)
  return [
    { label: '2nd place', slots: slotsFor(1) },
    { label: '1st place', slots: slotsFor(0) },
    { label: '3rd place', slots: slotsFor(2) },
  ]
})

const editingCard = computed(() =>
  editing.value === null ? null : gen.winnersCards.value[editing.value])

async function replace(file) {
  if (editing.value === null) return
  await gen.setWinnersCard(editing.value, file)
}
</script>

<template>
  <section class="flex w-full flex-col gap-6 rounded-2xl bg-surface p-6 md:p-8">
    <CardgenCanvasPreview :scene="gen.winnersScene.value" :scope="WINNERS" />

    <div class="grid gap-4 sm:grid-cols-3">
      <div v-for="group in groups" :key="group.label" class="flex flex-col gap-2">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {{ group.label }}
        </p>
        <CardgenCardField
          v-for="slot in group.slots"
          :key="slot"
          :card="gen.winnersCards.value[slot]"
          :scope="WINNERS"
          :index="slot"
          @file="gen.setWinnersCard(slot, $event)"
          @edit="editing = slot"
          @clear="gen.clearWinnersCard(slot)"
        />
      </div>
    </div>

    <p v-if="gen.error.value" class="text-center text-sm text-danger">{{ gen.error.value }}</p>

    <div class="flex justify-center">
      <button
        type="button"
        :disabled="!gen.winnersReady.value || gen.busy.value"
        class="h-11 w-44 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        :class="gen.winnersReady.value && !gen.busy.value
          ? 'bg-accent text-canvas hover:opacity-90'
          : 'cursor-not-allowed bg-surface text-muted'"
        @click="gen.downloadWinners"
      >
        {{ gen.busy.value ? 'Working…' : 'Download' }}
      </button>
    </div>

    <CardgenCardEditModal
      v-if="editingCard"
      :card="editingCard"
      @update="gen.updateWinnersCard(editing, $event)"
      @replace="replace"
      @close="editing = null"
    />
  </section>
</template>
