<script setup lang="ts">
import {
  UIRowLayout,
  UIText,
} from '@wisemen/vue-core-design-system'
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  isInteractive?: boolean
  icon?: Component | null
  label?: string | null
}>(), {
  isInteractive: false,
  icon: null,
  label: null,
})
</script>

<template>
  <UIRowLayout
    :class="{
      'hover:bg-fg-primary/2 dark:hover:bg-fg-primary/5': props.isInteractive,
    }"
    gap="xs"
    class="size-full px-sm"
  >
    <Component
      :is="props.icon"
      v-if="props.icon !== null"
      class="size-3 text-primary"
    />

    <UIText
      v-if="props.label !== null"
      :text="props.label"
      class="text-xs text-primary"
    />

    <slot />
  </UIRowLayout>
</template>
