<script setup lang="ts">
import {
  computed,
  onMounted,
  useSlots,
} from 'vue'

import type { DashboardPageProps } from '@/ui/page/dashboardPage.type'
import DashboardPageDetailPane from '@/ui/page/DashboardPageDetailPane.vue'
import DashboardPageDetailPaneToggle from '@/ui/page/DashboardPageDetailPaneToggle.vue'
import DashboardPageHeader from '@/ui/page/DashboardPageHeader.vue'
import { useDetailPane } from '@/ui/page/detailPane.composable'
import { useProvideDetailPaneContext } from '@/ui/page/detailPane.context'
import type { DetailPaneConfig } from '@/ui/page/detailPane.type'
import Page from '@/ui/page/Page.vue'
import Separator from '@/ui/separator/Separator.vue'

const props = withDefaults(defineProps<DashboardPageProps & {
  detailPane?: DetailPaneConfig | null
}>(), {
  actions: () => [],
  breadcrumbs: () => [],
  detailPane: null,
  tabs: () => [],
})

const isOpen = defineModel<boolean>('isDetailPaneOpen', {
  default: true,
})

const slots = useSlots()

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
  variant: props.detailPane?.variant ?? 'bordered-inline',
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

function warnIfMissingH1(): void {
  const h1El = document.querySelector('h1') ?? null

  if (h1El === null) {
    console.warn('[DashboardPage] No <h1> found in the default slot. For accessibility reasons, please ensure that there is exactly one <h1> element within the default slot content.')
  }
}

onMounted(() => {
  warnIfMissingH1()
})
</script>

<template>
  <Page
    class="relative flex size-full h-full flex-col overflow-hidden bg-secondary"
  >
    <DashboardPageHeader
      :title="props.title"
      :tabs="props.tabs"
      :breadcrumbs="props.breadcrumbs"
      :actions="props.actions"
    >
      <template
        v-if="slots.title"
        #title
      >
        <slot name="title" />
      </template>

      <template
        v-if="slots['title-left']"
        #title-left
      >
        <slot name="title-left" />
      </template>

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
        <slot
          name="header-master-actions"
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
