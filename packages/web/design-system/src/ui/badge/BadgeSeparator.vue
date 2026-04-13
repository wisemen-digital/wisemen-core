<script setup lang="ts">
import { useInjectBadgeContext } from '@/ui/badge/badge.context'
import { UISeparator } from '@/ui/separator/index'

const {
  variants,
} = useInjectBadgeContext()
</script>

<template>
  <UISeparator
    :class="variants.separator()"
    orientation="vertical"
  />
</template>
