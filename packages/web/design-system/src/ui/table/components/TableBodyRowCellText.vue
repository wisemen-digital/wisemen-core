<script setup lang="ts">
const props = withDefaults(defineProps<{
  isPrimaryCell?: boolean
  text: string
}>(), {
  isPrimaryCell: false,
})
</script>

<template>
  <span
    :class="{
      'font-medium': props.isPrimaryCell,
    }"
    class="truncate text-xs text-secondary"
  >
    {{ props.text }}
  </span>
</template>
