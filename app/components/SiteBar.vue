<template>
  <!--
    The site's one piece of navigation, drawn as a browser tab. It "attaches"
    to the window below it: no bottom border, overlapping the window's top
    border by 2px (-mb-0.5), with its own background painting over that line.
  -->
  <nav aria-label="Main" class="flex items-end pl-6 pr-5 md:pl-8">
    <NuxtLink
      to="/"
      class="relative z-10 -mb-0.5 inline-flex h-11 items-center gap-2 rounded-t-2xl border-2 border-b-0 border-accent bg-canvas px-4 font-tab text-base uppercase leading-none tracking-[0.3em] text-ink transition-colors hover:bg-accent hover:text-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-lg"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-5 shrink-0"
      >
        <rect x="8" y="4" width="11" height="15" rx="2" />
        <path d="M5 7v11a2 2 0 0 0 2 2h8" />
      </svg>
      <!--
        Letter-spacing adds a gap AFTER the last letter too, which makes the
        right padding look bigger than the left. -mr-[0.3em] cancels it.
      -->
      <span class="-mr-[0.3em]">Karuta Stuff</span>
    </NuxtLink>

    <!-- window "traffic lights" — purely decorative -->
    <div class="ml-auto hidden gap-5 self-center pb-2 sm:flex" aria-hidden="true">
      <span class="size-4 rounded-full bg-[#a6e3a1]" />
      <span class="size-4 rounded-full bg-[#f9f1a5]" />
      <span class="size-4 rounded-full bg-[#f5a3a3]" />
    </div>
  </nav>
</template>
