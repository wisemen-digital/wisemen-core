<script setup lang="ts">
const props = defineProps<{
  paddingAfterPx: number
  paddingBeforePx: number
}>()
</script>

<template>
  <div
    v-if="props.paddingBeforePx > 0"
    :style="{ height: `${props.paddingBeforePx}px` }"
    class="col-span-full"
  />

  <slot />

  <div
    v-if="props.paddingAfterPx > 0"
    :style="{ height: `${props.paddingAfterPx}px` }"
    class="col-span-full"
  />
</template>
