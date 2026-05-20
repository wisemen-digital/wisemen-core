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
  <div class="h-full overflow-hidden">
    <div
      :class="{
        'max-w-3xl': !props.isFullWidth,
        'py-4xl': props.hasVerticalPadding,
      }"
      class="relative mx-auto flex size-full flex-col px-3xl"
    >
      <slot />
    </div>
  </div>
</template>
