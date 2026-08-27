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
    class="col-span-full grid grid-cols-subgrid bg-secondary"
    role="row"
  >
    <div class="col-span-full p-xl">
      <slot />
    </div>
  </div>
</template>
