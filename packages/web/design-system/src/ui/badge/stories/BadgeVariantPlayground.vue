<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import { Settings01Icon } from '@wisemen/vue-core-icons'

import type { BadgeColor } from '@/ui/badge/badge.props'
import Badge from '@/ui/badge/Badge.vue'

const props = withDefaults(defineProps<{
  color?: BadgeColor
  variant: 'outline' | 'solid' | 'translucent'
}>(), {
  color: 'gray',
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
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Sizes
      </p>
      <div class="flex items-center gap-3">
        <Badge
          :color="props.color"
          :variant="props.variant"
          label="Small"
          size="sm"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          label="Medium"
          size="md"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          label="Large"
          size="lg"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With dot
      </p>
      <div class="flex items-center gap-3">
        <Badge
          :color="props.color"
          :variant="props.variant"
          :has-dot="true"
          label="Small"
          size="sm"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          :has-dot="true"
          label="Medium"
          size="md"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          :has-dot="true"
          label="Large"
          size="lg"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        With icon
      </p>
      <div class="flex items-center gap-3">
        <Badge
          :color="props.color"
          :variant="props.variant"
          :icon="Settings01Icon"
          label="Small"
          size="sm"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          :icon="Settings01Icon"
          label="Medium"
          size="md"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          :icon="Settings01Icon"
          label="Large"
          size="lg"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        All colors
      </p>
      <div class="flex items-center gap-3">
        <Badge
          v-for="colorItem in colors"
          :key="colorItem"
          :color="colorItem"
          :variant="props.variant"
          :label="colorItem"
        />
      </div>
    </div>
  </div>
</template>
