<script setup lang="ts">
import { useInjectToastContext } from '@/components/toast/toast.context'

const {
  preview,
} = useInjectToastContext()
</script>

<template>
  <Component
    :is="preview"
    v-if="preview !== null"
  />
</template>
