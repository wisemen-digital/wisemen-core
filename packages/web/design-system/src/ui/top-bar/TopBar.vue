<script setup lang="ts">
import { useInjectConfigContext } from '@/ui/config-provider'
import DashboardPageDetailPaneToggle from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPaneToggle.vue'
import DashboardPageHeaderBreadcrumbs from '@/ui/dashboard-page/header/DashboardPageHeaderBreadcrumbs.vue'
import DashboardPageHeaderSidebarToggle from '@/ui/dashboard-page/header/DashboardPageHeaderSidebarToggle.vue'
import { useInjectMainContentDetailPaneContext } from '@/ui/layout/mainContentDetailPane.context'
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
  hasDetailPane, isToggleHidden,
} = useInjectMainContentDetailPaneContext()
</script>

<template>
  <div class="flex shrink-0 items-center px-xl pb-md">
    <div class="flex min-w-0 flex-1 items-center">
      <DashboardPageHeaderSidebarToggle class="shrink-0" />

      <Separator
        v-if="breadcrumbs.length > 0 || title !== null"
        class="ml-sm h-4 shrink-0"
        orientation="vertical"
      />

      <template v-if="showNavigationArrowsInTopBar">
        <TopBarNavigationArrows class="ml-sm shrink-0" />

        <Separator
          v-if="breadcrumbs.length > 0 || title !== null"
          class="ml-sm h-4 shrink-0"
          orientation="vertical"
        />
      </template>

      <template v-if="breadcrumbs.length > 0">
        <h1
          class="
            ml-lg min-w-0 flex-1 text-xs text-primary
            md:sr-only
          "
        >
          {{ title }}
        </h1>

        <DashboardPageHeaderBreadcrumbs
          :breadcrumbs="breadcrumbs"
          class="
            ml-lg hidden min-w-0 flex-1
            md:flex
          "
        />
      </template>

      <h1
        v-else-if="title !== null"
        class="ml-lg min-w-0 flex-1 text-xs text-primary"
      >
        {{ title }}
      </h1>
    </div>

    <div
      class="
        hidden flex-1 items-center justify-center
        md:flex
      "
    >
      <TopBarCommandMenuSearch />
    </div>

    <div class="flex h-full shrink-0 items-center justify-end">
      <slot name="actions" />
      <DashboardPageDetailPaneToggle v-if="hasDetailPane && !isToggleHidden" />
    </div>
  </div>
</template>
