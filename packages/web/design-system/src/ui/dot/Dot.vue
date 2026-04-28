<script setup lang="ts">
import type { DotProps } from '@/ui/dot/dot.props'
import { dotVariants } from '@/ui/dot/dot.style'

const props = withDefaults(defineProps<DotProps>(), {
  color: 'gray',
  size: 'md',
})
</script>

<template>
  <div
    :class="dotVariants({
      color: props.color,
      size: props.size })"
  />
</template>
