<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import {
  computed,
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
import DashboardPageDetailPaneToggle from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPaneToggle.vue'
import { useDetailPane } from '@/ui/dashboard-page/detail-pane/detailPane.composable'
import { useProvideDetailPaneContext } from '@/ui/dashboard-page/detail-pane/detailPane.context'
import type { DetailPaneConfig } from '@/ui/dashboard-page/detail-pane/detailPane.type'
import Page from '@/ui/dashboard-page/Page.vue'
import { UIRowLayout } from '@/ui/row-layout'
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

const isOpen = defineModel<boolean>('isDetailPaneOpen', {
  default: true,
})

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
  isOpen: detailPaneIsOpen,
  isResizable,
  isResizing,
  sidebarWidth,
  toggleIsOpen,
  variant,
  onResizeKeyDown,
  onResizeStart,
} = useDetailPane({
  isOpen,
  isResizable: props.detailPane?.isResizable ?? true,
  storage: props.detailPane?.storage ?? null,
  variant: props.detailPane?.variant ?? 'full-height-inline',
})

if (hasDetailPane.value) {
  useProvideDetailPaneContext({
    isFloatingDetailPane: computed<boolean>(() => isFloatingDetailPane.value),
    isOpen: detailPaneIsOpen,
    isResizable,
    isResizing,
    sidebarWidth,
    toggleIsOpen,
    variant,
    onResizeKeyDown,
    onResizeStart,
  })
}

const isPageActionsSlotVisible = computed<boolean>(() => {
  if (hasDetailPane.value) {
    return true
  }

  return slots['page-actions-left'] !== undefined || slots['page-actions-right'] !== undefined
})
</script>

<template>
  <Page class="z-1 flex min-h-0 flex-1 flex-col overflow-hidden bg-primary">
    <DashboardPageActions v-if="isPageActionsSlotVisible">
      <template #left>
        <slot name="page-actions-left" />
      </template>

      <template #right>
        <UIRowLayout gap="none">
          <slot name="page-actions-right" />
          <DashboardPageDetailPaneToggle v-if="props.detailPane !== null" />
        </UIRowLayout>
      </template>
    </DashboardPageActions>

    <div class="relative flex size-full overflow-hidden">
      <DashboardPageDetailPanePadding>
        <div class="flex size-full flex-col overflow-hidden">
          <slot />
        </div>
      </DashboardPageDetailPanePadding>

      <DashboardPageDetailPane v-if="hasDetailPane">
        <slot name="detail-pane" />
      </DashboardPageDetailPane>
    </div>
  </Page>
</template>
