<script setup lang="ts">
import type { Component } from 'vue'

import type { ToastType } from '@/ui/toast/toast.type'

const props = defineProps<{
  icon: Component
  type?: ToastType
}>()
</script>

<template>
  <div class="flex h-text-sm items-center">
    <Component
      :is="props.icon"
      :class="{
        'text-error-primary': props.type === 'error',
        'text-warning-primary': props.type === 'warning',
        'text-tertiary': props.type === 'info' || props.type === 'loading' || props.type === undefined,
      }"
      class="size-4"
    />
  </div>
</template>
