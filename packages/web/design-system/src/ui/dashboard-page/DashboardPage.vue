<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import {
  computed,
  useSlots,
  watch,
} from 'vue'

import { useInjectConfigContext } from '@/ui/config-provider'
import type {
  DashboardPageProps,
  PageBreadcrumb,
} from '@/ui/dashboard-page/dashboardPage.type'
import DashboardPageDetailPane from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPane.vue'
import { useDetailPane } from '@/ui/dashboard-page/detail-pane/detailPane.composable'
import { useProvideDetailPaneContext } from '@/ui/dashboard-page/detail-pane/detailPane.context'
import type { DetailPaneConfig } from '@/ui/dashboard-page/detail-pane/detailPane.type'
import Page from '@/ui/dashboard-page/Page.vue'
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
</script>

<template>
  <Page
    class="flex min-h-0 flex-1 flex-col overflow-hidden bg-primary"
  >
    <div class="relative flex size-full overflow-hidden">
      <div class="flex size-full flex-col overflow-hidden">
        <slot />
      </div>

      <DashboardPageDetailPane v-if="hasDetailPane">
        <slot name="detail-pane" />
      </DashboardPageDetailPane>
    </div>
  </Page>
</template>
