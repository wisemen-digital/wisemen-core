<script setup lang="ts">
import { useInjectToastContext } from '@/components/toast/toast.context'

const {
  title,
  customClassConfig,
  style,
} = useInjectToastContext()
</script>

<template>
  <span
    :class="style.title({
      class: customClassConfig.title,
    })"
  >
    {{ title }}
  </span>
</template>
