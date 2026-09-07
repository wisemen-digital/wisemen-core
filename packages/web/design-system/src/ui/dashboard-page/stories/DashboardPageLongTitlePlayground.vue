<script setup lang="ts">
import { Bell01Icon } from '@wisemen/vue-core-icons'
import { computed } from 'vue'

import { UIBadge } from '@/ui/badge'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import DashboardPageContent from '@/ui/dashboard-page/content/DashboardPageContent.vue'
import type { PageBreadcrumb } from '@/ui/dashboard-page/dashboardPage.type'
import DashboardPage from '@/ui/dashboard-page/DashboardPage.vue'
import MainContent from '@/ui/layout/MainContent.vue'
import MainLayout from '@/ui/layout/MainLayout.vue'
import MainSidebarHeaderLogoWithText from '@/ui/sidebar/components/MainSidebarHeaderLogoWithText.vue'
import MainSidebar from '@/ui/sidebar/MainSidebar.vue'

const breadcrumbs = computed<PageBreadcrumb[]>(() => ([
  {
    label: 'Issues & preventive maintenance',
    to: {
      path: '/issues',
    },
  },
]))
</script>

<template>
  <div
    class="
      relative flex w-full resize-x overflow-auto rounded-lg border
      border-secondary
    "
    style="min-width: 320px; max-width: 100%;"
  >
    <MainLayout class="h-[50dvh]!">
      <MainSidebar collapsed-variant="minified">
        <template #header>
          <MainSidebarHeaderLogoWithText
            url="../../../storybook-assets/wisemen-logo.png"
            name="Wisemen"
          />
        </template>
      </MainSidebar>

      <MainContent>
        <template #top-bar-actions>
          <UIBadge
            :icon="Bell01Icon"
            color="warning"
            label="3 Alerts"
          />
        </template>

        <DashboardPage
          :breadcrumbs="breadcrumbs"
          title="Issues & preventive maintenance"
        >
          <DashboardPageContent>
            <ColumnLayout>
              <div class="rounded-lg border border-secondary p-4xl">
                <p class="text-sm text-secondary">
                  Drag the bottom-right corner of this container to resize it and check that the
                  title/breadcrumb truncates instead of overlapping the search bar.
                </p>
              </div>
            </ColumnLayout>
          </DashboardPageContent>
        </DashboardPage>
      </MainContent>
    </MainLayout>
  </div>
</template>
