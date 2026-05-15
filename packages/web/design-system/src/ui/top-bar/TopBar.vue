<script setup lang="ts">
import DashboardPageHeaderBreadcrumbs from '@/ui/dashboard-page/header/DashboardPageHeaderBreadcrumbs.vue'
import DashboardPageHeaderSidebarToggle from '@/ui/dashboard-page/header/DashboardPageHeaderSidebarToggle.vue'
import Separator from '@/ui/separator/Separator.vue'
import TopBarCommandMenuSearch from '@/ui/top-bar/TopBarCommandMenuSearch.vue'
import { useTopBarNavigation } from '@/ui/top-bar/topBarNavigation.composable'

const {
  title, breadcrumbs,
} = useTopBarNavigation()
</script>

<template>
  <div class="flex shrink-0 items-center px-xl pb-md">
    <div class="flex flex-1 items-center">
      <DashboardPageHeaderSidebarToggle />

      <Separator
        v-if="breadcrumbs.length > 0 || title !== null"
        class="mr-lg ml-md h-4"
        orientation="vertical"
      />

      <template v-if="breadcrumbs.length > 0">
        <h1 class="sr-only">
          {{ title }}
        </h1>

        <DashboardPageHeaderBreadcrumbs :breadcrumbs="breadcrumbs" />
      </template>

      <h1
        v-else-if="title !== null"
        class="text-xs text-primary"
      >
        {{ title }}
      </h1>
    </div>

    <div class="flex flex-1 items-center justify-center">
      <TopBarCommandMenuSearch />
    </div>

    <div class="flex flex-1 items-center justify-end">
      <slot name="actions" />
    </div>
  </div>
</template>
