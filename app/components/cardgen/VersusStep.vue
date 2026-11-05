<script setup>
// Step two in versus mode: build a matchup on the left, collect them on the
// right, download the lot together.
//
// The add buttons and the drawer share one spot, as the wireframe has them:
// while something is being built the buttons are out of the way, and once it
// is finished they come back. Clicking anywhere outside a finished drawer
// files it, so the common case needs no button at all.

import { DRAFT } from '~/composables/useCardgen'

const gen = useCardgen()
const editing = ref(null)
const confirming = ref(false)
const multiInput = ref(null)
const bgInput = ref(null)
const builderBox = ref(null)

const editingCard = computed(() =>
  editing.value === null ? null : gen.draft.value?.cards[editing.value])

// The preview gives up width rather than growing past --preview-max-h; see
// CanvasPreview. Here the cap goes on the wrapper rather than the preview, so
// the replace-background button pinned to its corner shrinks along with it
// instead of drifting off to one side.
const previewBox = computed(() => {
  const size = gen.draftScene.value?.canvas ?? { w: 5, h: 3 }
  return { maxWidth: `calc(var(--preview-max-h) * ${size.w} / ${size.h})` }
})

const addButtons = [
  { size: 'pair', label: 'Pair', hint: 'Add 2 card matchup' },
  { size: 'trio', label: 'Trio', hint: 'Add 3 card matchup' },
  { size: 'multi', label: 'Multi', hint: 'Add multiple matchups (4+ cards)' },
]

function start(size) {
  if (size === 'multi') multiInput.value?.click()
  else gen.startDraft(size)
}

async function replace(file) {
  if (editing.value === null) return
  await gen.setDraftCard(editing.value, file)
}

function remove() {
  const id = gen.draft.value?.id
  if (id) gen.removeMatchup(id)
  gen.cancelDraft()
}

function onMulti(event) {
  const files = [...(event.target.files ?? [])]
  if (files.length) gen.addMulti(files)
  event.target.value = ''
}

function onBackground(event) {
  const file = event.target.files?.[0]
  if (file) gen.setBackground(file)
  event.target.value = ''
}

/**
 * Clicking away from a finished matchup files it.
 *
 * Away means outside the whole builder column, not just the drawer: the
 * preview above it is part of the same job, and cards are rearranged by
 * dragging them around it. A half-filled matchup is left alone, since there
 * is nothing to file yet and closing it would throw away the cards already
 * picked. Modals sit outside the column in the DOM but are plainly part of
 * it, so they are excluded too.
 */
function onOutside(event) {
  if (!gen.draft.value || !gen.draftReady.value) return
  if (editing.value !== null || confirming.value) return
  if (builderBox.value?.contains(event.target)) return
  gen.commitDraft()
}

function clearAll() {
  confirming.value = false
  gen.clearAll()
}

onMounted(() => document.addEventListener('pointerdown', onOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside))
</script>

<template>
  <section class="grid w-full gap-8 rounded-2xl bg-surface p-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:p-8">
    <!-- builder -->
    <div ref="builderBox" class="flex flex-col gap-5">
      <div class="relative mx-auto w-full" :style="previewBox">
        <CardgenCanvasPreview v-if="gen.draft.value" :scene="gen.draftScene.value" :scope="DRAFT" />
        <div v-else class="w-full overflow-hidden rounded-xl border border-line bg-canvas/40" style="aspect-ratio: 5 / 3">
          <img
            v-if="gen.background.value"
            :src="gen.background.value.src"
            alt="The uploaded background"
            class="h-full w-full object-contain"
          >
        </div>

        <button
          type="button"
          aria-label="Replace the background"
          title="Replace the background"
          class="absolute bottom-2 left-2 grid size-9 place-items-center rounded-lg border border-line bg-surface/90 text-ink shadow-sm transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @click="bgInput?.click()"
        >
          <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11.5 2.5l2 2L6 12l-3 1 1-3z" />
          </svg>
        </button>
      </div>

      <!-- the drawer takes this spot while something is being built -->
      <div v-if="!gen.draft.value" class="flex flex-col items-center gap-3">
        <div v-for="button in addButtons" :key="button.size" class="group relative">
          <button
            type="button"
            class="flex w-32 items-center gap-3 text-base font-semibold text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            @click="start(button.size)"
          >
            <span class="grid size-8 shrink-0 place-items-center rounded-full border-2 border-current">
              <svg viewBox="0 0 16 16" class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M8 3.5v9M3.5 8h9" />
              </svg>
            </span>
            {{ button.label }}
          </button>
          <span
            class="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap text-xs text-muted/70 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            {{ button.hint }}
          </span>
        </div>
      </div>

      <div v-else>
        <CardgenMatchupDrawer
          :draft="gen.draft.value"
          :team-size="gen.teamSize.value"
          @file="(slot, file) => gen.setDraftCard(slot, file)"
          @edit="editing = $event"
          @clear="gen.clearDraftCard($event)"
          @commit="gen.commitDraft"
          @delete="remove"
        />
      </div>
    </div>

    <!-- gallery -->
    <div class="flex flex-col gap-4">
      <div class="flex min-h-80 flex-1 flex-col rounded-xl bg-canvas/60 p-4">
        <div v-if="gen.matchups.value.length" class="flex flex-1 flex-wrap content-start items-start gap-5">
          <CardgenMatchupChip
            v-for="entry in gen.matchups.value"
            :key="entry.id"
            :matchup="entry"
            :active="gen.draft.value?.id === entry.id"
            @edit="gen.editMatchup(entry.id)"
            @remove="gen.removeMatchup(entry.id)"
            @download="gen.downloadMatchup(entry.id)"
          />
        </div>
        <p v-else class="grid flex-1 place-items-center text-center text-sm text-muted">
          Matchups you add will collect here.
        </p>

        <p v-if="gen.matchups.value.length" class="pt-3 text-center text-xs text-muted/70">
          Drag around cards to reorder
        </p>
      </div>

      <p v-if="gen.error.value" class="text-center text-sm text-danger">{{ gen.error.value }}</p>

      <div class="flex flex-col items-center gap-2">
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            :disabled="!gen.versusReady.value"
            class="h-11 w-28 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
            :class="gen.versusReady.value
              ? 'bg-danger text-white hover:opacity-90'
              : 'cursor-not-allowed bg-surface text-muted'"
            @click="confirming = true"
          >
            Clear
          </button>

          <button
            type="button"
            :disabled="!gen.versusReady.value"
            class="h-11 w-32 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            :class="gen.versusReady.value
              ? 'bg-line text-ink hover:opacity-90'
              : 'cursor-not-allowed bg-surface text-muted'"
            @click="gen.shuffleMatchups"
          >
            Shuffle
          </button>

          <button
            type="button"
            :disabled="!gen.versusReady.value || gen.busy.value"
            class="h-11 w-40 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            :class="gen.versusReady.value && !gen.busy.value
              ? 'bg-accent text-canvas hover:opacity-90'
              : 'cursor-not-allowed bg-surface text-muted'"
            @click="gen.downloadMatchups"
          >
            {{ gen.busy.value ? 'Working…' : 'Download' }}
          </button>
        </div>
        <p v-if="gen.progress.value" class="text-xs text-muted">{{ gen.progress.value }}</p>
      </div>
    </div>

    <CardgenCardEditModal
      v-if="editingCard"
      :card="editingCard"
      @update="gen.updateDraftCard(editing, $event)"
      @replace="replace"
      @close="editing = null"
    />

    <CardgenConfirmModal
      v-if="confirming"
      title="Are you sure you want to clear all the matchups?"
      confirm-label="Clear"
      @confirm="clearAll"
      @cancel="confirming = false"
    />

    <input ref="multiInput" type="file" accept="image/*" multiple class="sr-only" @change="onMulti">
    <input ref="bgInput" type="file" accept="image/*" class="sr-only" @change="onBackground">
  </section>
</template>
