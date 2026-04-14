<script setup lang="ts">
import { useBreakpoints } from '@vueuse/core'
import {
  computed,
  useSlots,
} from 'vue'

import type {
  PageBreadcrumb,
  PageTab,
} from '@/ui/page/dashboardPage.type'
import DashboardPageContainer from '@/ui/page/DashboardPageContainer.vue'
import DashboardPageHeaderActions from '@/ui/page/DashboardPageHeaderActions.vue'
import DashboardPageHeaderBreadcrumbs from '@/ui/page/DashboardPageHeaderBreadcrumbs.vue'
import DashboardPageHeaderSidebarToggle from '@/ui/page/DashboardPageHeaderSidebarToggle.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import Separator from '@/ui/separator/Separator.vue'

const props = defineProps<{
  title: string | null
  breadcrumbs: PageBreadcrumb[]
  tabs: PageTab[]
}>()

const slots = useSlots()

const screen = useBreakpoints({
  lg: 1024,
})

const isSmallScreen = screen.smaller('lg')

const hasSlotContent = computed<boolean>(() => {
  return Boolean(slots['action-left'] || slots['action-center'] || slots['action-right'])
})
</script>

<template>
  <header class="border-b border-secondary">
    <div class="flex h-11 items-center">
      <DashboardPageContainer>
        <RowLayout justify="between">
          <RowLayout gap="none">
            <DashboardPageHeaderSidebarToggle />

            <Separator
              v-if="props.breadcrumbs.length > 0 || props.title !== null"
              class="mr-lg ml-md h-4.5 bg-quaternary"
              orientation="vertical"
            />
            <RowLayout
              gap="xl"
            >
              <RowLayout
                v-if="props.breadcrumbs.length === 0 && props.title !== null"
                gap="none"
              >
                <slot name="title-left" />

                <slot name="title">
                  <h1 class="text-sm font-medium text-primary">
                    {{ props.title }}
                  </h1>
                </slot>
              </RowLayout>

              <h1
                v-if="props.breadcrumbs.length > 0 && props.title !== null"
                class="sr-only"
              >
                {{ props.title }}
              </h1>

              <RowLayout gap="xs">
                <DashboardPageHeaderBreadcrumbs :breadcrumbs="props.breadcrumbs" />
              </RowLayout>

              <template v-if="!isSmallScreen">
                <slot name="action-left" />
              </template>
            </RowLayout>
          </RowLayout>

          <template v-if="!isSmallScreen">
            <slot name="action-center" />
          </template>

          <RowLayout

            gap="xs"
          >
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
      v-if="isSmallScreen && hasSlotContent"
      class="flex h-11 items-center border-t border-secondary"
    >
      <DashboardPageContainer>
        <RowLayout justify="between">
          <slot name="action-left" />

          <slot name="action-center" />

          <RowLayout gap="xs">
            <slot name="action-right" />
          </RowLayout>
        </RowLayout>
      </DashboardPageContainer>
    </div>
  </header>
</template>
