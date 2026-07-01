<script setup lang="ts">
import { createAction } from '@wisemen/vue-core-actions'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BarChartSquare02Icon,
  Bell01Icon,
  CalendarIcon,
  File05Icon,
  InfoCircleIcon,
  LifeBuoy01Icon,
  PlusIcon,
  Rows01Icon,
  Settings01Icon,
  Trash01Icon,
  User01Icon,
} from '@wisemen/vue-core-icons'
import type { Component } from 'vue'
import {
  computed,
  ref,
} from 'vue'

import { UIBadge } from '@/ui/badge'
import {
  UIButton,
  UIIconButton,
} from '@/ui/button/index'
import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import DashboardPageActions from '@/ui/dashboard-page/content/DashboardPageActions.vue'
import DashboardPageContent from '@/ui/dashboard-page/content/DashboardPageContent.vue'
import type { PageBreadcrumb } from '@/ui/dashboard-page/dashboardPage.type'
import DashboardPage from '@/ui/dashboard-page/DashboardPage.vue'
import DashboardPageDetailPaneCloseButton from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPaneCloseButton.vue'
import DashboardPageDetailPaneFooter from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPaneFooter.vue'
import DashboardPageDetailPaneHeader from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPaneHeader.vue'
import DashboardPageDetailPaneTabs from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPaneTabs.vue'
import DashboardPageDetailPaneTabsContent from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPaneTabsContent.vue'
import DashboardPageDetailPaneTabsList from '@/ui/dashboard-page/detail-pane/DashboardPageDetailPaneTabsList.vue'
import type { MainLayoutVariant } from '@/ui/layout/index'
import MainContent from '@/ui/layout/MainContent.vue'
import MainLayout from '@/ui/layout/MainLayout.vue'
import { UIRowLayout } from '@/ui/row-layout'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import MainSidebarFooterAccountCard from '@/ui/sidebar/components/MainSidebarFooterAccountCard.vue'
import MainSidebarFooterFeaturedCard from '@/ui/sidebar/components/MainSidebarFooterFeaturedCard.vue'
import MainSidebarGlobalSearch from '@/ui/sidebar/components/MainSidebarGlobalSearch.vue'
import MainSidebarHeaderLogoWithText from '@/ui/sidebar/components/MainSidebarHeaderLogoWithText.vue'
import MainSidebarHeaderReturnToApp from '@/ui/sidebar/components/MainSidebarHeaderReturnToApp.vue'
import MainSidebarNavigationGroup from '@/ui/sidebar/components/MainSidebarNavigationGroup.vue'
import MainSidebarNavigationLink from '@/ui/sidebar/components/MainSidebarNavigationLink.vue'
import MainSidebar from '@/ui/sidebar/MainSidebar.vue'
import { UITabsItem } from '@/ui/tabs'
import Tabs from '@/ui/tabs/Tabs.vue'
import TabsItem from '@/ui/tabs/TabsItem.vue'
import TabsList from '@/ui/tabs/TabsList.vue'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<{
  variant?: MainLayoutVariant
}>(), {
  variant: 'default',
})

interface NavigationGroup {
  label: string
  links: NavigationItem[]
}

interface NavigationItem {
  name: string
  icon: Component
  to: any
}

const navigation = computed<NavigationGroup[]>(() => ([
  {
    label: 'Main',
    links: [
      {
        name: 'Dashboard',
        icon: BarChartSquare02Icon,
        to: {
          path: '/',
        },
      },
      {
        name: 'Projects',
        icon: Rows01Icon,
        to: {
          path: '/projects',
        },
      },
    ],
  },
  {
    label: 'Other',
    links: [
      {
        name: 'Documents',
        icon: File05Icon,
        to: {
          path: '/documents',
        },
      },
      {
        name: 'Calendar',
        icon: CalendarIcon,
        to: {
          path: '/calendar',
        },
      },
    ],
  },
]))

const footerNavigation = computed<NavigationGroup[]>(() => ([
  {
    label: '',
    links: [
      {
        name: 'Support',
        icon: LifeBuoy01Icon,
        to: {
          path: '/support',
        },
      },
      {
        name: 'Settings',
        icon: Settings01Icon,
        to: {
          path: '/settings',
        },
      },
    ],
  },
]))

const breadcrumbs = computed<PageBreadcrumb[]>(() => ([
  {
    label: 'Projects',
    to: {
      path: '/projects',
    },
  },
  {
    label: 'Project Alpha',
    to: {
      path: '/projects/alpha',
    },
  },
]))

const tabsModelValue = ref<string>('tab1')
const detailPaneTab = ref<string>('info')

const exampleAction = createAction({
  id: 'example',
  name: () => 'Example',
  availableWhenUnauthenticated: true,
  execute: () => {},
})
</script>

<template>
  <div
    class="
      relative flex w-full overflow-hidden rounded-lg border border-secondary
    "
  >
    <MainLayout
      :variant="props.variant"
      class="h-[80dvh]!"
    >
      <MainSidebar
        collapsed-variant="minified"
      >
        <template #header>
          <MainSidebarHeaderReturnToApp
            v-if="false"
            to="/"
          />
          <MainSidebarHeaderLogoWithText
            v-if="true"
            url="../../../storybook-assets/wisemen-logo.png"
            name="Wisemen"
          >
            <template #right>
              <MainSidebarGlobalSearch />
            </template>
          </MainSidebarHeaderLogoWithText>
        </template>

        <template #navigation>
          <MainSidebarNavigationGroup
            v-for="group in navigation"
            :key="group.label"
            :label="group.label"
          >
            <MainSidebarNavigationLink
              v-for="link in group.links"
              :key="link.name"
              :to="link.to"
              :icon="link.icon"
              :label="link.name"
            />
          </MainSidebarNavigationGroup>
        </template>

        <template #footer>
          <MainSidebarFooterFeaturedCard />
          <MainSidebarNavigationGroup
            v-for="group in footerNavigation"
            :key="group.label"
            :label="group.label"
          >
            <MainSidebarNavigationLink
              v-for="link in group.links"
              :key="link.name"
              :to="link.to"
              :icon="link.icon"
              :label="link.name"
            />
          </MainSidebarNavigationGroup>
          <MainSidebarFooterAccountCard
            :actions="[exampleAction]"
            avatar-url="../../../storybook-assets/profile-picture.jpg"
            name="Jane Doe"
            email="jane.doe@example.com"
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
          :is-detail-pane-open="true"
          :breadcrumbs="breadcrumbs"
          :detail-pane="{
            variant: 'full-height-inline',
            storage: {
              key: 'detail-pane',
              strategy: 'localStorage',
            },
          }"
          title="Dashboard"
        >
          <template #page-actions-left>
            <RowLayout>
              <Tabs
                v-model="tabsModelValue"
                variant="button-border"
              >
                <TabsList>
                  <TabsItem
                    label="Tab"
                    value="tab1"
                  />
                  <TabsItem
                    label="Tab"
                    value="tab2"
                  />
                  <TabsItem
                    label="Tab"
                    value="tab3"
                  />
                </TabsList>
              </Tabs>
            </RowLayout>
          </template>

          <template #page-actions-right>
            <UIRowLayout>
              <UIIconButton
                :icon="Trash01Icon"
                variant="destructive-primary"
                size="md"
                label="Destructive"
              />
              <UIIconButton
                :icon="PlusIcon"
                size="md"
                label="Button"
              />
              <UIIconButton
                :icon="InfoCircleIcon"
                variant="secondary"
                size="md"
                label="Secondary"
              />
            </UIRowLayout>
          </template>

          <DashboardPageActions>
            <template #left>
              <div>
                <UIButton
                  :icon-right="ArrowRightIcon"
                  variant="secondary"
                  size="md"
                  label="Page Actions Left"
                />
              </div>
            </template>
            <template #right>
              <div>
                <UIButton
                  :icon-left="ArrowLeftIcon"
                  variant="secondary"
                  size="md"
                  label="Page Actions Right"
                />
              </div>
            </template>
          </DashboardPageActions>

          <DashboardPageContent>
            <ColumnLayout>
              <div class="rounded-lg border border-secondary p-4xl">
                <p class="text-sm text-secondary">
                  Main content area. The detail pane pushes this content to the left when open.
                </p>
              </div>
              <div class="h-200 rounded-lg border border-secondary p-4xl">
                <UIText
                  class="text-sm text-secondary"
                  text="Overflow test"
                />
              </div>
            </ColumnLayout>
          </DashboardPageContent>

          <template #detail-pane>
            <DashboardPageDetailPaneHeader
              :left="{
                icon: User01Icon,
                type: 'featured-icon',
              }"
              title="Detail Pane"
            >
              <template #actions>
                <DashboardPageDetailPaneCloseButton />
              </template>
              <template #subtitle>
                <UIText
                  text="What a nice pane"
                  class="text-xs text-tertiary"
                />
              </template>
            </DashboardPageDetailPaneHeader>

            <DashboardPageDetailPaneTabs v-model="detailPaneTab">
              <DashboardPageDetailPaneTabsList>
                <UITabsItem
                  label="Info"
                  value="info"
                />
                <UITabsItem
                  label="History"
                  value="history"
                />
              </DashboardPageDetailPaneTabsList>

              <DashboardPageDetailPaneTabsContent value="info">
                <ColumnLayout class="p-lg">
                  <div
                    v-for="n in 20"
                    :key="n"
                    class="rounded-lg border border-secondary p-lg"
                  >
                    <p class="text-sm text-secondary">
                      Info item {{ n }}
                    </p>
                  </div>
                </ColumnLayout>
              </DashboardPageDetailPaneTabsContent>

              <DashboardPageDetailPaneTabsContent value="history">
                <ColumnLayout class="p-lg">
                  <p class="text-sm text-secondary">
                    History content
                  </p>
                </ColumnLayout>
              </DashboardPageDetailPaneTabsContent>
            </DashboardPageDetailPaneTabs>

            <DashboardPageDetailPaneFooter>
              <UIRowLayout justify="end">
                <UIButton
                  label="Save"
                  size="md"
                />
              </UIRowLayout>
            </DashboardPageDetailPaneFooter>
          </template>
        </DashboardPage>
      </MainContent>
    </MainLayout>
  </div>
</template>
