<template>
  <!--
    The same window as layouts/default.vue, with the padding pulled in. Tools
    cap their own width and want every pixel of it; the generous page padding
    would only squeeze the canvas preview.
  -->
  <div class="flex min-h-screen flex-col bg-canvas p-3 text-ink md:p-5">
    <SiteBar />

    <main class="@container flex flex-1 flex-col rounded-3xl border-2 border-accent p-4 md:p-6">
      <slot />
    </main>
  </div>
</template>
