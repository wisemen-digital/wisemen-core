<script setup lang="ts">
import { defineMeta } from 'sb-addon-vue-csf'

import NumberBadgePlayground from './NumberBadgePlayground.vue'

const {
  Story,
} = defineMeta({
  title: 'Components/NumberBadge',
  argTypes: {
    color: {
      control: 'select',
      description: 'Color palette applied to the number badge',
      options: [
        'gray',
        'brand',
        'error',
        'success',
        'warning',
        'purple',
        'pink',
      ],
    },
    size: {
      control: 'select',
      description: 'Controls the size of the number badge',
      options: [
        'md',
        'lg',
      ],
    },
    value: {
      control: 'number',
      description: 'Number displayed inside the badge',
    },
    variant: {
      control: 'select',
      description: 'Visual style applied to the number badge',
      options: [
        'translucent',
        'outline',
        'solid',
      ],
    },
  },
  tags: [
    'autodocs',
  ],
  component: NumberBadgePlayground,
})
</script>

<template>
  <Story
    :args="{ color: 'gray',
             size: 'md',
             value: 5,
             variant: 'translucent' }"
    name="Default"
  />

  <Story
    :args="{ color: 'brand',
             size: 'md',
             value: 12,
             variant: 'solid' }"
    name="Solid"
  />

  <Story
    :args="{ color: 'error',
             size: 'md',
             value: 3,
             variant: 'outline' }"
    name="Outline"
  />

  <Story
    :args="{ color: 'success',
             size: 'lg',
             value: 99,
             variant: 'translucent' }"
    name="LargeSize"
  />
</template>
