<script setup lang="ts">
import { Motion } from 'motion-v'

import { useDetailPanePadding } from '@/ui/dashboard-page/detail-pane/detailPanePadding.composable'

const {
  contentPaddingRight, transitionDuration,
} = useDetailPanePadding()
</script>

<template>
  <Motion
    :initial="{
      marginRight: contentPaddingRight,
    }"
    :animate="{
      marginRight: contentPaddingRight,
    }"
    :transition="{
      duration: transitionDuration,
      type: 'spring',
      bounce: 0,
    }"
    :as-child="true"
  >
    <slot />
  </Motion>
</template>
