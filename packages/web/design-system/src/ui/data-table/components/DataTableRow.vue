<script setup lang="ts">
const props = withDefaults(defineProps<{
  isLast?: boolean
}>(), {
  isLast: false,
})
</script>

<template>
  <div
    :class="{
      'border-b border-secondary': !props.isLast,
    }"
    class="
      col-span-full grid grid-cols-subgrid bg-primary
      hover:bg-secondary-hover
    "
    role="row"
  >
    <slot />
  </div>
</template>
