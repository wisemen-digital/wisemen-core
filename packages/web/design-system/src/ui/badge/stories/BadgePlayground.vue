<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import { Settings01Icon } from '@wisemen/vue-core-icons'

import type { BadgeColor } from '@/ui/badge/badge.props'
import Badge from '@/ui/badge/Badge.vue'
import BadgeGroup from '@/ui/badge/BadgeGroup.vue'

const props = withDefaults(defineProps<{
  hasDot?: boolean
  color?: BadgeColor
  label?: string | null
  rounded?: 'default' | 'full'
  size?: 'lg' | 'md' | 'sm'
  variant?: 'outline' | 'solid' | 'translucent'
}>(), {
  hasDot: false,
  color: 'gray',
  label: 'Badge',
  rounded: 'default',
  size: 'md',
  variant: 'translucent',
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

const variants: Array<'outline' | 'solid' | 'translucent'> = [
  'translucent',
  'outline',
  'solid',
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Interactive
      </p>
      <div>
        <Badge
          :color="props.color"
          :has-dot="props.hasDot"
          :label="props.label"
          :rounded="props.rounded"
          :size="props.size"
          :variant="props.variant"
        />
      </div>
    </div>

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
        Rounded
      </p>
      <div class="flex items-center gap-3">
        <Badge
          :color="props.color"
          :variant="props.variant"
          label="Default"
          rounded="default"
        />
        <Badge
          :color="props.color"
          :variant="props.variant"
          label="Full"
          rounded="full"
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
          label="With dot"
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
          label="With icon"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Badge group
      </p>
      <BadgeGroup>
        <Badge
          v-for="colorItem in colors"
          :key="colorItem"
          :color="colorItem"
          :variant="props.variant"
          :label="colorItem"
        />
      </BadgeGroup>
    </div>

    <div class="flex flex-col gap-4">
      <p class="text-sm font-medium text-secondary">
        All colors &amp; variants
      </p>
      <div
        v-for="variantItem in variants"
        :key="variantItem"
        class="flex flex-col gap-2"
      >
        <p class="text-xs text-tertiary">
          {{ variantItem }}
        </p>
        <div class="flex items-center gap-3">
          <Badge
            v-for="colorItem in colors"
            :key="colorItem"
            :color="colorItem"
            :variant="variantItem"
            :label="colorItem"
          />
        </div>
      </div>
    </div>
  </div>
</template>
