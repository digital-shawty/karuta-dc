<script setup>
// A yes-or-no dialog for the one action here that cannot be undone.
//
// The confirming button carries the danger colour and the way out is the
// plain one, so the quick answer is the safe answer.

defineProps({
  title: { type: String, required: true },
  confirmLabel: { type: String, default: 'Confirm' },
  cancelLabel: { type: String, default: 'Cancel' },
})

const emit = defineEmits(['confirm', 'cancel'])

function onKey(event) {
  if (event.key === 'Escape') emit('cancel')
}

onMounted(() => document.addEventListener('keydown', onKey))
onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    class="fixed inset-0 z-50 grid place-items-center bg-canvas/80 p-4"
    @pointerdown.self="emit('cancel')"
  >
    <div
      role="alertdialog"
      aria-modal="true"
      :aria-label="title"
      class="flex w-full max-w-sm flex-col gap-5 rounded-xl bg-surface p-6 text-ink"
    >
      <p class="text-base font-semibold">{{ title }}</p>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="h-10 rounded-lg bg-accent px-5 text-sm font-semibold text-canvas transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          @click="emit('cancel')"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          class="h-10 rounded-lg bg-danger px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
