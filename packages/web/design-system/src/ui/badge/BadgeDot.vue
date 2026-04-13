<script setup lang="ts">
import { useInjectBadgeContext } from '@/ui/badge/badge.context'

const {
  effectiveDotColor,
  size,
  variant,
  variants,
} = useInjectBadgeContext()
</script>

<template>
  <div
    :class="[variants.dot({
      color: effectiveDotColor,
      variant,
      size,
    })]"
  />
</template>
