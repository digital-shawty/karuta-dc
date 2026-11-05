<template>
  <!--
    The site chrome: a tab bar above an outlined "browser window" that the
    page plugs into. Every route gets this; tools use layouts/tool.vue, which
    is the same window with less padding.
  -->
  <div class="flex min-h-screen flex-col bg-canvas p-3 text-ink md:p-5">
    <SiteBar />

    <!-- @container so text inside can size itself relative to the window. -->
    <main class="@container flex flex-1 flex-col rounded-3xl border-2 border-accent p-6 md:p-10">
      <slot />
    </main>
  </div>
</template>
