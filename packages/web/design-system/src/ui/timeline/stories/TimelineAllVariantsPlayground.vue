<script setup lang="ts">
import type {
  TimelineSize,
  TimelineVariant,
} from '@/ui/timeline/timeline.props'

import TimelinePlayground from './TimelinePlayground.vue'

const sizes: TimelineSize[] = [
  'sm',
  'md',
]

const variants: TimelineVariant[] = [
  'solid',
  'outline',
  'subtle',
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <div
      v-for="size in sizes"
      :key="size"
      class="flex flex-col gap-4"
    >
      <p class="text-sm font-medium text-secondary uppercase">
        {{ size }}
      </p>

      <div
        class="
          grid gap-4
          xl:grid-cols-3
        "
      >
        <div
          v-for="variant in variants"
          :key="`${size}-${variant}`"
          class="flex flex-col gap-2"
        >
          <p class="text-xs font-medium text-tertiary capitalize">
            {{ variant }}
          </p>
          <TimelinePlayground
            :size="size"
            :variant="variant"
          />
        </div>
      </div>
    </div>
  </div>
</template>
