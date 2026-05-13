<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import {
  computed,
  onUnmounted,
  useSlots,
  watchEffect,
} from 'vue'

import { useInjectConfigContext } from '@/ui/config-provider'
import type { DashboardPageProps } from '@/ui/dashboard-page/dashboardPage.type'
import DashboardPageDetailPane from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPane.vue'
import DashboardPageDetailPaneToggle from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPaneToggle.vue'
import { useDetailPane } from '@/ui/dashboard-page/detail-pane/detailPane.composable'
import { useProvideDetailPaneContext } from '@/ui/dashboard-page/detail-pane/detailPane.context'
import type { DetailPaneConfig } from '@/ui/dashboard-page/detail-pane/detailPane.type'
import DashboardPageHeader from '@/ui/dashboard-page/header/DashboardPageHeader.vue'
import Page from '@/ui/dashboard-page/Page.vue'
import Separator from '@/ui/separator/Separator.vue'
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
  clearNavigation, setNavigation,
} = useTopBarNavigation()

watchEffect(() => {
  documentTitle.value = `${props.title} — ${configContext.projectName.value}`
  setNavigation(props.title, props.breadcrumbs ?? [])
})

onUnmounted(() => {
  clearNavigation()
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
    <DashboardPageHeader>
      <template
        v-if="slots['header-action-left']"
        #action-left
      >
        <slot name="header-action-left" />
      </template>

      <template
        v-if="slots['header-action-center']"
        #action-center
      >
        <slot name="header-action-center" />
      </template>

      <template
        v-if="slots['header-action-right']"
        #action-right
      >
        <slot name="header-action-right" />
      </template>

      <template
        #master-actions
      >
        <Separator
          v-if="slots['header-master-actions'] || hasDetailPane"
          class="mr-md ml-lg h-4.5 bg-quaternary"
          orientation="vertical"
        />
        <DashboardPageDetailPaneToggle v-if="hasDetailPane" />
      </template>
    </DashboardPageHeader>

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
