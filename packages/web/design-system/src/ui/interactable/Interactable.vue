<script setup lang="ts">
import { Primitive } from 'reka-ui'

import type { InteractableProps } from '@/ui/interactable/interactable.props'
import { twMerge } from '@/utils/twMerge.util'

const props = withDefaults(defineProps<InteractableProps>(), {
  class: null,
})
</script>

<template>
  <Primitive
    :as-child="true"
    :class="twMerge(
      `
        cursor-pointer rounded-sm outline-fg-brand-primary
        focus-visible:outline-2
        disabled:cursor-not-allowed
      `,
      props.class,
    )"
  >
    <slot />
  </Primitive>
</template>
