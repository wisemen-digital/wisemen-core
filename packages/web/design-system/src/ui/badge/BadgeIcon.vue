<script setup lang="ts">
import type { Component } from 'vue'
import { useAttrs } from 'vue'

import { useInjectBadgeContext } from '@/ui/badge/badge.context'

const props = defineProps<{
  icon: Component
}>()

const {
  variants,
} = useInjectBadgeContext()

const attrs = useAttrs()
</script>

<template>
  <Component
    :is="props.icon"
    :class="[
      variants.icon({
        class: attrs.class as string,
      }),
    ]"
  />
</template>
