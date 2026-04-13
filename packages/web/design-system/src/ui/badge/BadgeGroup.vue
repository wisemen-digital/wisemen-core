<script setup lang="ts">
import { UIRowLayout } from '@/ui/row-layout/index'

const props = withDefaults(defineProps<{
  noWrap?: boolean
}>(), {
  noWrap: false,
})
</script>

<template>
  <UIRowLayout
    :class="{
      'flex-wrap': !props.noWrap,
    }"
    gap="xs"
  >
    <slot />
  </UIRowLayout>
</template>
