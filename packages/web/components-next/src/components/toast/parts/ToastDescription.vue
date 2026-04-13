<script setup lang="ts">
import { useInjectToastContext } from '@/components/toast/toast.context'

const {
  customClassConfig,
  description,
  style,
} = useInjectToastContext()
</script>

<template>
  <p
    :class="style.description({
      class: customClassConfig.description,
    })"
    v-html="description"
  />
</template>
