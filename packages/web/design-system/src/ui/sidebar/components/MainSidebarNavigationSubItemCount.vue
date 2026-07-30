<script setup lang="ts">
const props = defineProps<{
  isActive: boolean
  label: string
}>()
</script>

<template>
  <span
    :class="props.isActive ? 'text-brand-secondary' : 'text-tertiary'"
    class="text-xxs leading-none tabular-nums"
  >
    {{ props.label }}
  </span>
</template>
