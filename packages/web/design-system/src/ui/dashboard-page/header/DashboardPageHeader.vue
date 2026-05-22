<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'
import {
  computed,
  useSlots,
} from 'vue'

import DashboardPageContainer from '@/ui/dashboard-page/DashboardPageContainer.vue'
import DashboardPageHeaderActions from '@/ui/dashboard-page/header/DashboardPageHeaderActions.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'

const slots = useSlots()

const screen = useBreakpoints({
  lg: 1024,
})

const isSmallScreen = screen.smaller('lg')

const hasRightSlotContent = computed<boolean>(() => Boolean(slots['action-right']))
</script>

<template>
  <header class="border-b border-secondary">
    <div class="flex h-11 items-center">
      <DashboardPageContainer>
        <RowLayout justify="between">
          <RowLayout gap="none">
            <slot name="action-left" />
          </RowLayout>

          <slot name="action-center" />

          <RowLayout gap="xs">
            <slot
              v-if="!isSmallScreen"
              name="action-right"
            />

            <DashboardPageHeaderActions>
              <slot name="master-actions" />
            </DashboardPageHeaderActions>
          </RowLayout>
        </RowLayout>
      </DashboardPageContainer>
    </div>

    <div
      v-if="isSmallScreen && hasRightSlotContent"
      class="flex h-11 items-center border-t border-secondary"
    >
      <DashboardPageContainer>
        <RowLayout justify="end">
          <RowLayout gap="xs">
            <slot name="action-right" />
          </RowLayout>
        </RowLayout>
      </DashboardPageContainer>
    </div>
  </header>
</template>
