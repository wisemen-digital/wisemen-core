<script setup lang="ts">
import type { Component } from 'vue'
import { useAttrs } from 'vue'

import { useInjectBadgeContext } from '@/ui/badge/badge.context'
import type { BadgeColor } from '@/ui/badge/badge.props'
import { badgeIconVariants } from '@/ui/badge/badge.style'

const props = defineProps<{
  color?: BadgeColor
  icon: Component
}>()

const {
  variants,
} = useInjectBadgeContext()

const attrs = useAttrs()
</script>

<template>
  <Component
    :is="props.icon"
    :class="[
      variants.icon({
        class: props.color != null ? badgeIconVariants({ color: props.color }) : undefined,
      }),
      attrs.class,
    ]"
  />
</template>
