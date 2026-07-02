<script setup lang="ts">
import { UIRowLayout } from '@/ui/row-layout/index'

const props = withDefaults(defineProps<{
  isWrapped?: boolean
}>(), {
  isWrapped: true,
})
</script>

<template>
  <UIRowLayout
    :class="{
      'flex-wrap': props.isWrapped,
    }"
    gap="xs"
  >
    <slot />
  </UIRowLayout>
</template>
