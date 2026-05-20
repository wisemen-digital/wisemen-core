<script setup lang="ts">
import { computed } from 'vue'

import type { FeaturedIconProps } from '@/ui/featured-icon/featuredIcon.props'
import { featuredIconVariants } from '@/ui/featured-icon/featuredIcon.style'

const props = withDefaults(defineProps<FeaturedIconProps>(), {
  color: 'gray',
  size: 'md',
  variant: 'translucent',
})

const variants = computed(() =>
  featuredIconVariants({
    color: props.color,
    size: props.size,
    variant: props.variant,
  }))
</script>

<template>
  <div :class="variants.base()">
    <Component
      :is="props.icon"
      :class="variants.icon()"
    />
  </div>
</template>
