<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import {
  computed,
  onUnmounted,
  useSlots,
  watch,
} from 'vue'

import { useInjectConfigContext } from '@/ui/config-provider'
import DashboardPageActions from '@/ui/dashboard-page/content/DashboardPageActions.vue'
import type {
  DashboardPageProps,
  PageBreadcrumb,
} from '@/ui/dashboard-page/dashboardPage.type'
import DashboardPageDetailPanePadding from '@/ui/dashboard-page/DashboardPageDetailPanePadding.vue'
import DashboardPageDetailPane from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPane.vue'
import { useDetailPane } from '@/ui/dashboard-page/detail-pane/detailPane.composable'
import { useProvideDetailPaneContext } from '@/ui/dashboard-page/detail-pane/detailPane.context'
import type { DetailPaneConfig } from '@/ui/dashboard-page/detail-pane/detailPane.type'
import Page from '@/ui/dashboard-page/Page.vue'
import { useInjectMainContentDetailPaneContext } from '@/ui/layout/mainContentDetailPane.context'
import { useTopBarNavigation } from '@/ui/top-bar/topBarNavigation.composable'

const props = withDefaults(defineProps<DashboardPageProps & {
  detailPane?: DetailPaneConfig | null
}>(), {
  isTitleHidden: false,
  actions: () => [],
  breadcrumbs: () => [],
  detailPane: null,
  tabs: () => [],
})

const mainContentDetailPaneContext = useInjectMainContentDetailPaneContext(null)

const configContext = useInjectConfigContext()
const slots = useSlots()
const documentTitle = useTitle()

const {
  setNavigation,
} = useTopBarNavigation()

watch([
  (): string => props.title,
  (): PageBreadcrumb[] => props.breadcrumbs,
], ([
  title,
  breadcrumbs,
]) => {
  documentTitle.value = `${title} — ${configContext.projectName.value}`
  setNavigation(title, breadcrumbs)
}, {
  immediate: true,
})

const hasDetailPane = computed<boolean>(() => {
  return props.detailPane !== null && slots['detail-pane'] !== undefined
})

const {
  isFloatingDetailPane,
  isOpen: computedIsDetailPaneOpen,
  isResizable,
  isResizing,
  sidebarWidth,
  toggleIsOpen,
  variant,
  onResizeKeyDown,
  onResizeStart,
} = useDetailPane({
  isResizable: props.detailPane?.isResizable ?? true,
  storage: props.detailPane?.storage ?? null,
  variant: props.detailPane?.variant ?? 'full-height-inline',
})

if (hasDetailPane.value) {
  useProvideDetailPaneContext({
    isFloatingDetailPane: computed<boolean>(() => isFloatingDetailPane.value),
    isOpen: computedIsDetailPaneOpen,
    isResizable,
    isResizing,
    sidebarWidth,
    toggleIsOpen,
    variant,
    onResizeKeyDown,
    onResizeStart,
  })

  if (mainContentDetailPaneContext != null) {
    mainContentDetailPaneContext.registerDetailPane(computedIsDetailPaneOpen, toggleIsOpen)
    onUnmounted(() => mainContentDetailPaneContext.unregisterDetailPane())
  }
}

const isPageActionsSlotVisible = computed<boolean>(() => {
  return slots['page-actions-left'] !== undefined || slots['page-actions-right'] !== undefined
})
</script>

<template>
  <Page class="flex min-h-0 flex-1 flex-col overflow-hidden bg-primary">
    <DashboardPageActions v-if="isPageActionsSlotVisible">
      <template #left>
        <slot name="page-actions-left" />
      </template>

      <template #right>
        <slot name="page-actions-right" />
      </template>
    </DashboardPageActions>

    <div class="relative flex size-full overflow-hidden">
      <DashboardPageDetailPanePadding>
        <slot />
      </DashboardPageDetailPanePadding>

      <DashboardPageDetailPane v-if="hasDetailPane">
        <slot name="detail-pane" />
      </DashboardPageDetailPane>
    </div>
  </Page>
</template>
