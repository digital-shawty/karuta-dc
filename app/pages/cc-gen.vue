<script setup>
// The card comp generator.
//
// Client-only throughout. Every part of it touches File, Image or canvas,
// none of which exist while rendering on the server.

definePageMeta({ layout: 'tool' })

useHead({ title: 'Card Comp Generator — Karuta Stuff' })
</script>

<template>
  <ClientOnly>
    <CardgenApp />

    <template #fallback>
      <p class="p-8 text-sm text-muted">Loading the generator…</p>
    </template>
  </ClientOnly>
</template>
