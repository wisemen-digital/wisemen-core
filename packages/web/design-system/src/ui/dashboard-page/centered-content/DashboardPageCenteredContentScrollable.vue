<script setup lang="ts">
const props = withDefaults(defineProps<{
  hasVerticalPadding?: boolean
  isFullWidth?: boolean
}>(), {
  hasVerticalPadding: false,
  isFullWidth: false,
})
</script>

<template>
  <div class="overflow-y-auto pb-4xl">
    <div
      :class="{
        'max-w-3xl': !props.isFullWidth,
        'py-4xl': props.hasVerticalPadding,
      }"
      class="relative mx-auto flex w-full flex-col px-3xl"
    >
      <slot />
    </div>
  </div>
</template>
