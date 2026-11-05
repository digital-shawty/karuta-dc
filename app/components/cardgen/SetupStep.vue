<script setup>
// Step one: the background everything is built on, and the two switches that
// decide which of the six layouts gets used.
//
// The preview is the upload control. There is nothing else on the screen it
// could be confused with, and a big target beats a small button under a big
// empty box.

import { backgroundFit } from '~/utils/cardgen/presets'
import { BACKGROUND } from '~/utils/cardgen/types'

const gen = useCardgen()
const input = ref(null)
const over = ref(false)

// Backgrounds are stretched to the nominal size rather than letting the canvas
// take their shape, so it is worth saying so when the file is not already it.
const fit = computed(() => {
  const bg = gen.background.value
  return bg ? backgroundFit(bg) : null
})

// 16:9 comes out at about 0.067, which is fine and should not nag.
const CAUTION = 0.08
const SOFT = 0.15

function onPick(event) {
  const file = event.target.files?.[0]
  if (file) gen.setBackground(file)
  event.target.value = ''
}

// Whatever was dropped goes straight to the store, which is where files are
// vetted. Sifting the image out here instead would leave someone who dropped
// a PDF watching nothing happen.
function onDrop(event) {
  over.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) gen.setBackground(file)
}
</script>

<template>
  <section class="flex w-full flex-col gap-8 rounded-2xl bg-surface p-6 md:p-10">
    <!-- The switches centre against the background beside them, not its top edge. -->
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
      <div class="flex flex-col items-center gap-3">
        <button
          type="button"
          class="mx-auto w-full overflow-hidden rounded-xl border-2 bg-canvas/40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          :class="[
            over ? 'border-accent bg-accent/5' : 'border-line',
            gen.background.value ? 'border-solid' : 'border-dashed',
          ]"
          style="aspect-ratio: 5 / 3; max-width: calc(var(--preview-max-h) * 5 / 3)"
          @click="input?.click()"
          @dragover.prevent="over = true"
          @dragleave="over = false"
          @drop.prevent="onDrop"
        >
          <img
            v-if="gen.background.value"
            :src="gen.background.value.src"
            alt="The uploaded background"
            class="h-full w-full object-contain"
          >
          <span v-else class="grid h-full place-items-center px-4 text-center text-sm text-muted">
            Browse or drag image here
          </span>
        </button>

        <p class="max-w-prose text-center text-xs leading-relaxed text-muted/80">
          Final image will be adjusted to {{ BACKGROUND.w }} &times; {{ BACKGROUND.h }}, as this is the optimal size 
          to fit cards on a background. Please use backgrounds as close to these dimensions as possible to minimize distortion.
        </p>

        <button
          v-if="gen.background.value"
          type="button"
          class="h-11 rounded-lg border-2 border-dashed border-line/80 bg-surface/60 px-5 text-sm text-muted transition-colors hover:border-accent hover:bg-accent/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @click="input?.click()"
        >
          Replace background
        </button>

        <div v-if="gen.background.value" class="text-center text-xs leading-relaxed">
          <p class="text-muted">
            {{ gen.background.value.width }} &times; {{ gen.background.value.height }} pixels.
            <template v-if="fit.exact">Exact match.</template>
            <template v-else>
              Stretched to {{ BACKGROUND.w }} &times; {{ BACKGROUND.h }}.
            </template>
          </p>
          <p v-if="fit.distortion > CAUTION" class="mt-1 text-danger">
            That is a different shape, so the artwork will look squashed or
            pulled. A {{ BACKGROUND.w }} &times; {{ BACKGROUND.h }} background avoids it.
          </p>
          <p v-else-if="fit.upscale > SOFT" class="mt-1 text-danger">
            That is smaller than the target, so the background will look soft.
          </p>
        </div>
      </div>

      <div class="flex flex-col gap-5">
        <CardgenToggle
          :model-value="gen.mode.value"
          :options="['versus', 'winners']"
          :labels="{ versus: 'Versus', winners: 'Winners' }"
          @update:model-value="gen.setMode"
        />
        <CardgenToggle
          :model-value="gen.teamSize.value"
          :options="['singles', 'duos']"
          :labels="{ singles: 'Singles', duos: 'Duos' }"
          @update:model-value="gen.setTeamSize"
        />
        <p class="text-xs leading-relaxed text-muted">
          {{ gen.mode.value === 'winners'
            ? 'One podium image, first place largest.'
            : 'Build as many matchups as you like, then download them together.' }}
          {{ gen.teamSize.value === 'duos' ? 'Two cards per side.' : 'One card per side.' }}
        </p>
      </div>
    </div>

    <p v-if="gen.error.value" class="text-center text-sm text-danger">{{ gen.error.value }}</p>

    <div class="flex justify-center">
      <button
        type="button"
        :disabled="!gen.canAdvance.value"
        class="h-11 w-40 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        :class="gen.canAdvance.value
          ? 'bg-accent text-canvas hover:opacity-90'
          : 'cursor-not-allowed bg-surface text-muted'"
        @click="gen.next"
      >
        Next
      </button>
    </div>

    <input ref="input" type="file" accept="image/*" class="sr-only" @change="onPick">
  </section>
</template>
