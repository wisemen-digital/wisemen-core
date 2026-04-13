<script setup lang="ts">
import { Primitive } from 'reka-ui'

const props = withDefaults(defineProps<{
  testId: string | null
  as?: string | null
}>(), {
  as: null,
})
</script>

<template>
  <Primitive
    :as-child="props.as === null"
    :as="props.as ?? undefined"
    :data-test-id="props.testId"
  >
    <slot />
  </Primitive>
</template>
