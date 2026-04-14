<script setup lang="ts">
import { Motion } from 'motion-v'

import DashboardPageContainer from '@/ui/page/DashboardPageContainer.vue'
import { useDetailPanePadding } from '@/ui/page/detailPanePadding.composable'

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
    class="h-full overflow-auto"
  >
    <DashboardPageContainer class="py-4xl">
      <slot />
    </DashboardPageContainer>
  </Motion>
</template>
