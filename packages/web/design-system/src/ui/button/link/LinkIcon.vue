<script setup lang="ts">
import type { Component } from 'vue'

import type { ButtonProps } from '@/ui/button/button/button.props'

const props = defineProps<{
  icon: Component
  size: ButtonProps['size']
  variant: ButtonProps['variant']
}>()
</script>

<template>
  <Component
    :is="props.icon"
    v-if="props.icon !== null"
    :class="{
      // Size
      'size-3.5': props.size === 'md' || props.size === 'sm' || props.size === 'xs',
      'size-4': props.size === 'lg',
      // Variant
      'text-primary-on-brand group-disabled/button:text-disabled': props.variant === 'primary',
      'text-secondary group-disabled/button:text-disabled': props.variant === 'secondary' || props.variant === 'tertiary',
      'text-white group-disabled/button:text-disabled': props.variant === 'destructive-primary',
      'text-error-primary group-disabled/button:text-disabled': props.variant === 'destructive-tertiary',
    }"
    class="shrink-0"
  />
</template>
