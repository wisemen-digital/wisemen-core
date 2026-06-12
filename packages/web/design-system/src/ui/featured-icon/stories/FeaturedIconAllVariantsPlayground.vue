<script setup lang="ts">
import { Settings01Icon } from '@wisemen/vue-core-icons'

import type {
  FeaturedIconColor,
  FeaturedIconSize,
  FeaturedIconVariant,
} from '@/ui/featured-icon/featuredIcon.props'
import FeaturedIcon from '@/ui/featured-icon/FeaturedIcon.vue'

const props = withDefaults(defineProps<{
  size?: FeaturedIconSize
}>(), {
  size: 'md',
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

const variants: FeaturedIconVariant[] = [
  'translucent',
  'outline',
]
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
        <FeaturedIcon
          v-for="color in colors"
          :key="`${variant}-${color}`"
          :color="color"
          :icon="Settings01Icon"
          :size="props.size"
          :variant="variant"
        />
      </div>
    </div>
  </div>
</template>
