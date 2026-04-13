<script setup lang="ts">
import { Primitive } from 'reka-ui'

const props = withDefaults(defineProps<{
  isDisabled: boolean
  as?: string | null
}>(), {
  as: null,
})
</script>

<template>
  <Primitive
    :as-child="props.as === null"
    :as="props.as ?? undefined"
    :disabled="isDisabled"
  >
    <slot />
  </Primitive>
</template>
