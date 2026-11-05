<script setup>
// A two-state switch whose label reads out the state it is currently in,
// the way the wireframes show it: the control says VERSUS or WINNERS rather
// than naming one option and leaving you to work out what the other is.
//
// Drawn half again the size of an ordinary switch. These two decide which of
// the six layouts the whole job uses, and they are the only thing on the
// setup screen competing with a background the size of the window.

const props = defineProps({
  modelValue: { type: String, required: true },
  // [value, value] — first sits left, second sits right.
  options: { type: Array, required: true },
  labels: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue'])

const isSecond = computed(() => props.modelValue === props.options[1])
const label = computed(() => props.labels[props.modelValue])

function toggle() {
  emit('update:modelValue', isSecond.value ? props.options[0] : props.options[1])
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="isSecond"
    :aria-label="label"
    class="group flex items-center gap-[1.125rem] rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    @click="toggle"
  >
    <span
      class="relative inline-flex h-[2.625rem] w-[4.5rem] shrink-0 items-center rounded-full border-[3px] border-ink transition-colors"
      :class="isSecond ? 'bg-accent' : 'bg-surface'"
    >
      <span
        class="absolute size-6 rounded-full border-[3px] border-ink transition-[left] duration-150"
        :class="isSecond ? 'left-[2.4375rem] bg-surface' : 'left-1.5 bg-ink'"
      />
    </span>
    <span class="whitespace-nowrap text-[1.3125rem] font-semibold uppercase tracking-[0.18em]">{{ label }}</span>
  </button>
</template>
