<script setup>
// The index of the tools. One entry for now; this becomes a list.
useHead({ title: 'Karuta Stuff' })

const tools = [
  { label: 'Card Comp Generator', to: '/cc-gen' },
]
</script>

<template>
  <div class="flex flex-1 flex-col items-center justify-center gap-10 py-16">
    <p class="max-w-prose text-center text-[clamp(1rem,2cqi,1.5rem)] text-muted">
      Tools for Karuta, the Discord trading card bot.
    </p>

    <div class="flex flex-col items-center gap-5">
      <!--
        translate-y on hover walks the button into its own shadow, so pressing
        it looks like pressing it.
      -->
      <NuxtLink
        v-for="tool in tools"
        :key="tool.to"
        :to="tool.to"
        class="shadow-hard inline-flex items-center rounded-2xl border-2 border-accent px-7 py-5 text-center font-tab text-[clamp(0.875rem,2.2cqi,1.5rem)] uppercase leading-none tracking-[0.25em] text-accent transition-[background-color,color,translate,box-shadow] hover:translate-x-1 hover:translate-y-1 hover:bg-accent hover:text-canvas hover:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span class="-mr-[0.25em]">{{ tool.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
