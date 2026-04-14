<script setup lang="ts">
import { Primitive } from 'reka-ui'

import type { InputControlProps } from '@/ui/input-control/inputControl.props'
import Interactable from '@/ui/interactable/Interactable.vue'

const props = withDefaults(defineProps<InputControlProps>(), {
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
    <Interactable :is-disabled="props.isDisabled">
      <slot />
    </Interactable>
  </Primitive>
</template>
