<script setup lang="ts">
import { UIBadge } from '@/ui/badge'
import type { BadgeProps } from '@/ui/badge/badge.props'

const props = defineProps<Omit<BadgeProps, 'size'>>()
</script>

<template>
  <UIBadge
    v-bind="props"
    size="sm"
  />
</template>
