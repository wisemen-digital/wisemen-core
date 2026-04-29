<script setup lang="ts">
/**
 * A grid layout for responsive field layouts.
 */
const props = defineProps<{
  layout: '1-column' | '2-column' | '2-column-fixed' | '3-column'
}>()
</script>

<template>
  <div class="@container/field-grid w-full">
    <div
      :class="{
        'grid-cols-1 @sm/field-grid:grid-cols-2': props.layout === '2-column',
        'grid-cols-1 @sm/field-grid:grid-cols-3': props.layout === '3-column',
        'grid-cols-1': props.layout === '1-column',
        'grid-cols-2': props.layout === '2-column-fixed',
      }"
      class="grid gap-lg"
      role="group"
    >
      <slot />
    </div>
  </div>
</template>
