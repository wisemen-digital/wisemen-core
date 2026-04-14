<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import type { PageBreadcrumb } from '@/ui/page/dashboardPage.type'
import DashboardPage from '@/ui/page/DashboardPage.vue'
import SkeletonItem from '@/ui/skeleton-item/SkeletonItem.vue'

const props = defineProps<{
  breadcrumbs: PageBreadcrumb[]
}>()

const i18n = useI18n()
</script>

<template>
  <DashboardPage
    :breadcrumbs="props.breadcrumbs"
    title=""
  >
    <template #title>
      <h1 class="sr-only">
        {{ i18n.t('component.dashboard_page_loading_state.loading') }}
      </h1>

      <SkeletonItem class="h-4 w-24" />
    </template>
  </DashboardPage>
</template>
