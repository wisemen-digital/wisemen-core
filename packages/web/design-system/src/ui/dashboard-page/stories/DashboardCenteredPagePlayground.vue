<script setup lang="ts">
import {
  BarChartSquare02Icon,
  Bell01Icon,
  CalendarIcon,
  DotsGridIcon,
  File05Icon,
  LifeBuoy01Icon,
  Rows01Icon,
  Settings01Icon,
} from '@wisemen/vue-core-icons'
import type { Component } from 'vue'
import { computed } from 'vue'

import { UIBadge } from '@/ui/badge'
import { UIIconButton } from '@/ui/button'
import DashboardPageCenteredContent from '@/ui/dashboard-page/centered-content/DashboardPageCenteredContent.vue'
import DashboardPageCenteredContentHeader from '@/ui/dashboard-page/centered-content/DashboardPageCenteredContentHeader.vue'
import type { PageBreadcrumb } from '@/ui/dashboard-page/dashboardPage.type'
import DashboardPage from '@/ui/dashboard-page/DashboardPage.vue'
import MainContent from '@/ui/layout/MainContent.vue'
import MainLayout from '@/ui/layout/MainLayout.vue'
import { UIRowLayout } from '@/ui/row-layout'
import MainSidebarFooterAccountCard from '@/ui/sidebar/components/MainSidebarFooterAccountCard.vue'
import MainSidebarFooterFeaturedCard from '@/ui/sidebar/components/MainSidebarFooterFeaturedCard.vue'
import MainSidebarGlobalSearch from '@/ui/sidebar/components/MainSidebarGlobalSearch.vue'
import MainSidebarHeaderLogoWithText from '@/ui/sidebar/components/MainSidebarHeaderLogoWithText.vue'
import MainSidebarNavigationGroup from '@/ui/sidebar/components/MainSidebarNavigationGroup.vue'
import MainSidebarNavigationLink from '@/ui/sidebar/components/MainSidebarNavigationLink.vue'
import MainSidebar from '@/ui/sidebar/MainSidebar.vue'

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
    label: 'Settings',
    to: {
      path: '/settings',
    },
  },
  {
    label: 'Profile',
    to: {
      path: '/settings/profile',
    },
  },
]))
</script>

<template>
  <div
    class="
      relative flex w-full overflow-hidden rounded-lg border border-secondary
    "
  >
    <MainLayout
      class="h-[80dvh]!"
    >
      <MainSidebar
        collapsed-variant="minified"
      >
        <template #header>
          <MainSidebarHeaderLogoWithText
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
            :menu-options="[{
              icon: Settings01Icon,
              label: 'Account settings',
              onSelect: () => {},
            }, {
              icon: LifeBuoy01Icon,
              label: 'Support',
              onSelect: () => {},
            }]"
            :actions="[]"
            avatar-url="../../../storybook-assets/profile-picture.jpg"
            name="Jane Doe"
            email="jane.doe@example.com"
            @sign-out="() => {}"
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
          :detail-pane="{
            storage: {
              key: 'centered-page-detail-pane',
              strategy: 'localStorage',
            },
            variant: 'bordered-overlay',
          }"
          title="Profile"
        >
          <DashboardPageCenteredContent
            :has-vertical-padding="false"
          >
            <DashboardPageCenteredContentHeader
              :left-header-config="{
                type: 'featured-icon',
                icon: Settings01Icon,
              }"
              title="Settings"
            >
              <template #subtitle>
                <UIRowLayout v-if="true">
                  <UIBadge
                    label="10 assets"
                    size="sm"
                  />
                  <UIBadge
                    label="0 users"
                    size="sm"
                  />
                </UIRowLayout>
              </template>

              <template #actions>
                <UIIconButton
                  :icon="Bell01Icon"
                  label="Notifications"
                  variant="tertiary"
                />
                <UIIconButton
                  :icon="DotsGridIcon"
                  label="Settings"
                  variant="tertiary"
                />
              </template>
            </DashboardPageCenteredContentHeader>
            <div class="rounded-lg border border-secondary p-4xl">
              <p class="text-sm text-secondary">
                Centered content area with a max-width constraint. Ideal for forms and settings pages.
              </p>
            </div>
          </DashboardPageCenteredContent>

          <template #detail-pane>
            <div class="flex h-full flex-col gap-lg p-lg">
              <h2 class="text-sm font-medium text-primary">
                Detail Pane
              </h2>

              <p class="text-sm text-secondary">
                This is the detail pane content. It slides in from the right.
              </p>
            </div>
          </template>
        </DashboardPage>
      </MainContent>
    </MainLayout>
  </div>
</template>
