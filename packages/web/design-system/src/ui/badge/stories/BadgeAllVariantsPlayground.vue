<script setup lang="ts">
import type { BadgeColor } from '@/ui/badge/badge.props'
import Badge from '@/ui/badge/Badge.vue'

const props = withDefaults(defineProps<{
  hasDot?: boolean
  label?: string | null
  rounded?: 'default' | 'full'
  size?: 'lg' | 'md' | 'sm'
}>(), {
  hasDot: false,
  label: 'Badge',
  rounded: 'default',
  size: 'md',
})

const colors: BadgeColor[] = [
  'gray',
  'brand',
  'blue',
  'pink',
  'error',
  'success',
  'warning',
  'purple',
  'neutral',
]

const variants = [
  'translucent',
  'solid',
] as const
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      v-for="variant in variants"
      :key="variant"
      class="flex flex-col gap-2"
    >
      <p class="text-sm font-medium text-secondary capitalize">
        {{ variant }}
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <Badge
          v-for="color in colors"
          :key="`${variant}-${color}`"
          :color="color"
          :dot="props.hasDot ? {} : null"
          :label="props.label"
          :rounded="props.rounded"
          :size="props.size"
          :variant="variant"
        />
      </div>
    </div>
  </div>
</template>
