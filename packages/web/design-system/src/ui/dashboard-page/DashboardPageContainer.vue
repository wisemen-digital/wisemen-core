<script setup lang="ts">
import { twMerge } from '@/utils/twMerge.util'

const props = withDefaults(defineProps<{
  class?: string | null
}>(), {
  class: null,
})
</script>

<template>
  <div
    :class="twMerge(`mx-auto flex w-full flex-col px-2xl`, props.class)"
  >
    <slot />
  </div>
</template>
