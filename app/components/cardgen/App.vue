<script setup>
// The generator's shell: a title row, and whichever step is current.
// Deliberately spare, since the page it sits on has no site navigation.

import { loadFrameTable } from '~/utils/cardgen/frames'

const gen = useCardgen()

// The frame library is a 600 KB sprite fetched on the first card. Start it
// now, while the background is being picked, so that card is not held up.
onMounted(() => { loadFrameTable().catch(() => {}) })

const heading = computed(() => {
  if (gen.step.value === 'setup') return 'Start with a background'
  return gen.mode.value === 'winners' ? 'Build the podium' : 'Build your matchups'
})
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <header class="flex w-full flex-wrap items-baseline justify-between gap-3">
      <div>
        <h1 class="text-xl font-bold tracking-tight md:text-2xl">Card Comp Generator</h1>
        <p class="mt-0.5 text-sm text-muted">{{ heading }}</p>
      </div>

      <button
        v-if="gen.step.value === 'build'"
        type="button"
        class="text-sm font-semibold text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        @click="gen.back"
      >
        &larr; Background and mode
      </button>
    </header>

    <CardgenSetupStep v-if="gen.step.value === 'setup'" />
    <CardgenWinnersStep v-else-if="gen.mode.value === 'winners'" />
    <CardgenVersusStep v-else />

    <!-- Outside the steps, so a message is not torn down with the step. -->
    <CardgenToast />
  </div>
</template>
