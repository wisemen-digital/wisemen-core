<script setup lang="ts">
const props = withDefaults(defineProps<{
  orientation?: 'horizontal' | 'vertical'
}>(), {
  orientation: 'horizontal',
})
</script>

<template>
  <div
    :class="{
      'flex-col items-start @[15rem]:flex-row': props.orientation === 'horizontal',
      'flex-col': props.orientation === 'vertical',
    }"
    class="flex gap-xs"
  >
    <slot />
  </div>
</template>
