<script setup>
// The generator's one transient message, pinned to the top right.
//
// The store owns the text and the countdown, so the toast survives a step
// changing underneath it and a second rejection restarts the clock rather
// than stacking a second box up. This is only the window onto that.

const gen = useCardgen()
</script>

<template>
  <!--
    Clear of the site's tab bar, so a message never lands on top of the
    chrome. The role sits on the wrapper rather than the box: a live region
    has to be in the document before it fills for a reader to announce it.
    Assertive, because the visitor has just asked for something and it did
    not happen.
  -->
  <div
    class="pointer-events-none fixed right-4 top-20 z-50 flex justify-end md:right-6"
    role="alert"
  >
    <Transition name="toast">
      <div
        v-if="gen.toast.value"
        class="pointer-events-auto flex max-w-xs items-start gap-2.5 rounded-lg border-2 border-danger bg-danger-soft px-3.5 py-2.5 text-sm leading-snug text-ink shadow-lg"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
          class="mt-0.5 size-4 shrink-0 text-danger"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.5v5.5M12 16.5v.01" />
        </svg>

        <p class="min-w-0">{{ gen.toast.value }}</p>

        <button
          type="button"
          aria-label="Dismiss"
          class="-mr-1 -mt-0.5 shrink-0 rounded p-1 text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          @click="gen.dismissToast"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            aria-hidden="true"
            class="size-3.5"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 160ms ease, translate 160ms ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  translate: 0.5rem 0;
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active {
    transition: opacity 160ms ease;
  }
  .toast-enter-from,
  .toast-leave-to {
    translate: none;
  }
}
</style>
