<script setup lang="ts">
const props = defineProps<{
  side: 'bottom' | 'left' | 'right' | 'top'
}>()
</script>

<template>
  <div class="absolute">
    <div
      v-for="i in 3"
      :key="i"
      :class="{
        'mask-t-from-25% mask-t-to-100%': props.side === 'bottom',
      }"
      class="absolute inset-0 backdrop-blur-md"
    />
  </div>
</template>
