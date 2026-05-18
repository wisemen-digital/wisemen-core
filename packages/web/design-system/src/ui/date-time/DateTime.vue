<script setup lang="ts">
/**
 * A simple wrapper around the HTML `<time>` element to display date and time.
 */
const props = defineProps<{
  value: string
}>()
</script>

<template>
  <time :datetime="props.value">
    <slot />
  </time>
</template>
