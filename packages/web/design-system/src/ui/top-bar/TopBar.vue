<script setup lang="ts">
import { useInjectConfigContext } from '@/ui/config-provider'
import DashboardPageDetailPaneToggle from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPaneToggle.vue'
import DashboardPageHeaderBreadcrumbs from '@/ui/dashboard-page/header/DashboardPageHeaderBreadcrumbs.vue'
import DashboardPageHeaderSidebarToggle from '@/ui/dashboard-page/header/DashboardPageHeaderSidebarToggle.vue'
import { useInjectMainContentDetailPaneContext } from '@/ui/layout/mainContentDetailPane.context'
import { UISeparator } from '@/ui/separator'
import Separator from '@/ui/separator/Separator.vue'
import TopBarCommandMenuSearch from '@/ui/top-bar/TopBarCommandMenuSearch.vue'
import { useTopBarNavigation } from '@/ui/top-bar/topBarNavigation.composable'
import TopBarNavigationArrows from '@/ui/top-bar/TopBarNavigationArrows.vue'

const {
  showNavigationArrowsInTopBar,
} = useInjectConfigContext()

const {
  title, breadcrumbs,
} = useTopBarNavigation()

const {
  hasDetailPane,
} = useInjectMainContentDetailPaneContext()
</script>

<template>
  <div class="flex shrink-0 items-center px-xl pb-md">
    <div class="flex flex-1 items-center">
      <DashboardPageHeaderSidebarToggle />

      <Separator
        v-if="breadcrumbs.length > 0 || title !== null"
        class="ml-sm h-4"
        orientation="vertical"
      />

      <template v-if="showNavigationArrowsInTopBar">
        <TopBarNavigationArrows class="ml-sm" />

        <Separator
          v-if="breadcrumbs.length > 0 || title !== null"
          class="ml-sm h-4"
          orientation="vertical"
        />
      </template>

      <template v-if="breadcrumbs.length > 0">
        <h1 class="sr-only">
          {{ title }}
        </h1>

        <DashboardPageHeaderBreadcrumbs
          :breadcrumbs="breadcrumbs"
          class="ml-lg"
        />
      </template>

      <h1
        v-else-if="title !== null"
        class="ml-lg text-xs text-primary"
      >
        {{ title }}
      </h1>
    </div>

    <div class="flex flex-1 items-center justify-center">
      <TopBarCommandMenuSearch />
    </div>

    <div class="flex h-full flex-1 items-center justify-end">
      <slot name="actions" />
      <template v-if="hasDetailPane">
        <UISeparator
          class="mr-md ml-lg h-4"
          orientation="vertical"
        />
        <DashboardPageDetailPaneToggle />
      </template>
    </div>
  </div>
</template>
