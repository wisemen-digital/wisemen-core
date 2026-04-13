<script setup lang="ts">
import { Motion } from 'motion-v'

import DashboardPageContainer from '@/ui/page/DashboardPageContainer.vue'
import { useDetailPanePadding } from '@/ui/page/detailPanePadding.composable'
import RowLayout from '@/ui/row-layout/RowLayout.vue'

const {
  contentPaddingRight, transitionDuration,
} = useDetailPanePadding()
</script>

<template>
  <Motion
    :initial="{
      paddingRight: contentPaddingRight,
    }"
    :animate="{
      paddingRight: contentPaddingRight,
    }"
    :transition="{
      duration: transitionDuration,
      type: 'spring',
      bounce: 0,
    }"
    class="flex h-11 shrink-0 justify-center border-b border-secondary"
  >
    <DashboardPageContainer class="size-full">
      <slot>
        <RowLayout
          class="size-full"
          justify="between"
        >
          <slot name="left">
            <span />
          </slot>

          <slot name="right">
            <span />
          </slot>
        </RowLayout>
      </slot>
    </DashboardPageContainer>
  </Motion>
</template>
