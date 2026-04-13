<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { twMerge } from 'tailwind-merge'

import type { ClickableElementProps } from '@/ui/clickable-element/clickableElement.props'

const props = withDefaults(defineProps<ClickableElementProps>(), {
  isDefaultCursor: false,
  class: '',
})
</script>

<template>
  <Primitive
    :as-child="true"
    :class="twMerge(
      `
        rounded-sm outline-2 outline-transparent
        focus-visible:outline-fg-brand-primary
        disabled:cursor-not-allowed
      `,
      !props.isDefaultCursor && 'cursor-pointer',
      props.class,
    )"
  >
    <slot />
  </Primitive>
</template>
