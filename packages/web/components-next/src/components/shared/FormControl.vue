<script setup lang="ts">
import { Primitive } from 'reka-ui'

import InteractableElement from '@/components/shared/InteractableElement.vue'

const props = withDefaults(defineProps<{
  id: string | null
  isDisabled: boolean
  isInvalid: boolean
  isLoading: boolean
  isRequired: boolean
  as?: string | null
  describedBy: string
}>(), {
  as: null,
})
</script>

<template>
  <Primitive
    :id="props.id"
    :as="props.as ?? undefined"
    :as-child="props.as === null"
    :aria-invalid="props.isInvalid"
    :aria-describedby="props.describedBy"
    :aria-required="props.isRequired"
    :aria-busy="props.isLoading"
  >
    <InteractableElement :is-disabled="props.isDisabled">
      <slot />
    </InteractableElement>
  </Primitive>
</template>
