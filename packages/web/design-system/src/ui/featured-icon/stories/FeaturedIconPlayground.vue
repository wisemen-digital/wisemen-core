<script setup lang="ts">
import { Settings01Icon } from '@wisemen/vue-core-icons'

import type {
  FeaturedIconColor,
  FeaturedIconSize,
  FeaturedIconVariant,
} from '@/ui/featured-icon/featuredIcon.props'
import FeaturedIcon from '@/ui/featured-icon/FeaturedIcon.vue'

const props = withDefaults(defineProps<{
  color?: FeaturedIconColor
  size?: FeaturedIconSize
  variant?: FeaturedIconVariant
}>(), {
  color: 'gray',
  size: 'md',
  variant: 'translucent',
})

const colors: FeaturedIconColor[] = [
  'gray',
  'brand',
  'blue',
  'pink',
  'error',
  'success',
  'warning',
  'purple',
]

const sizes: FeaturedIconSize[] = [
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
]

const variants: FeaturedIconVariant[] = [
  'translucent',
  'outline',
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Interactive
      </p>
      <FeaturedIcon
        :color="props.color"
        :icon="Settings01Icon"
        :size="props.size"
        :variant="props.variant"
      />
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-secondary">
        Sizes
      </p>
      <div class="flex items-end gap-3">
        <FeaturedIcon
          v-for="sizeItem in sizes"
          :key="sizeItem"
          :color="props.color"
          :icon="Settings01Icon"
          :size="sizeItem"
          :variant="props.variant"
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
          <FeaturedIcon
            v-for="colorItem in colors"
            :key="colorItem"
            :color="colorItem"
            :icon="Settings01Icon"
            :variant="variantItem"
          />
        </div>
      </div>
    </div>
  </div>
</template>
