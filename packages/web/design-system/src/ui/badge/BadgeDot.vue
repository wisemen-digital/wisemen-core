<script setup lang="ts">
import { computed } from 'vue'

import { useInjectBadgeContext } from '@/ui/badge/badge.context'
import { UIDot } from '@/ui/dot'
import type {
  DotColor,
  DotSize,
} from '@/ui/dot/dot.props'

const {
  effectiveDotColor, size,
} = useInjectBadgeContext()

const dotColor = computed<DotColor>(() =>
  effectiveDotColor.value)

const dotSize = computed<DotSize>(() =>
  size.value === 'sm' ? 'sm' : 'md')
</script>

<template>
  <UIDot
    :color="dotColor"
    :size="dotSize"
  />
</template>
