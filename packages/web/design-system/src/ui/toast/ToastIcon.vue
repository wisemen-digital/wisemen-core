<script setup lang="ts">
import type { Component } from 'vue'

import type { ToastVariant } from '@/ui/toast/toast.type'

const props = defineProps<{
  icon: Component
  variant?: ToastVariant
}>()
</script>

<template>
  <div class="flex h-text-sm items-center">
    <Component
      :is="props.icon"
      :class="{
        'text-error-primary': props.variant === 'error',
        'text-warning-primary': props.variant === 'warning',
        'text-tertiary': props.variant === 'info' || props.variant === 'loading' || props.variant === undefined,
      }"
      class="size-4"
    />
  </div>
</template>
