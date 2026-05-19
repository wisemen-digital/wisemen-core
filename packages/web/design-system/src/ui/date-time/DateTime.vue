<script setup lang="ts">
const props = defineProps<{
  value: string
}>()
</script>

<template>
  <time :datetime="props.value">
    <slot />
  </time>
</template>
