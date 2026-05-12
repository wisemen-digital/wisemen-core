<script setup lang="ts">
import { AnimatePresence } from 'motion-v'

import DashboardPageDetailPaneTransition from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPaneTransition.vue'
import { useInjectDetailPaneContext } from '@/ui/dashboard-page/detail-pane/detailPane.context'

const {
  isOpen,
} = useInjectDetailPaneContext()
</script>

<template>
  <AnimatePresence :initial="false">
    <DashboardPageDetailPaneTransition
      v-if="isOpen"
    >
      <slot />
    </DashboardPageDetailPaneTransition>
  </AnimatePresence>
</template>
