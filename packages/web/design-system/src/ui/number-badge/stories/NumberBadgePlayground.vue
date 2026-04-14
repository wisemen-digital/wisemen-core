<script setup lang="ts">
/* eslint-disable @intlify/vue-i18n/no-raw-text */
import type { UtilityColor } from '@/types/utilityColor.type'
import NumberBadge from '@/ui/number-badge/NumberBadge.vue'

const props = withDefaults(defineProps<{
  color?: UtilityColor
  size?: 'lg' | 'md'
  value?: number
  variant?: 'outline' | 'solid' | 'translucent'
}>(), {
  color: 'gray',
  size: 'md',
  value: 5,
  variant: 'translucent',
})

const colors: UtilityColor[] = [
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
        <NumberBadge
          :color="props.color"
          :size="props.size"
          :value="props.value.toString()"
          :variant="props.variant"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Sizes
      </p>
      <div class="flex items-center gap-3">
        <NumberBadge
          :color="props.color"
          :variant="props.variant"
          value="8"
          size="md"
        />
        <NumberBadge
          :color="props.color"
          :variant="props.variant"
          value="8"
          size="lg"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Multi-digit values
      </p>
      <div class="flex items-center gap-3">
        <NumberBadge
          :color="props.color"
          :variant="props.variant"
          value="3"
        />
        <NumberBadge
          :color="props.color"
          :variant="props.variant"
          value="42"
        />
        <NumberBadge
          :color="props.color"
          :variant="props.variant"
          value="128"
        />
      </div>
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
          <NumberBadge
            v-for="colorItem in colors"
            :key="colorItem"
            :color="colorItem"
            :variant="variantItem"
            value="12"
          />
        </div>
      </div>
    </div>
  </div>
</template>
