<script setup lang="ts">
import {
  BarChartSquare02Icon,
  Bell01Icon,
  CalendarIcon,
  File05Icon,
  LifeBuoy01Icon,
  Rows01Icon,
  Settings01Icon,
} from '@wisemen/vue-core-icons'
import type { Component } from 'vue'
import { computed } from 'vue'

import { UIBadge } from '@/ui/badge'
import { UIColumnLayout } from '@/ui/column-layout'
import DashboardPageCenteredContentHeader from '@/ui/dashboard-page/centered-content/DashboardPageCenteredContentHeader.vue'
import DashboardPageCenteredContentScrollable from '@/ui/dashboard-page/centered-content/DashboardPageCenteredContentScrollable.vue'
import type { PageBreadcrumb } from '@/ui/dashboard-page/dashboardPage.type'
import DashboardPage from '@/ui/dashboard-page/DashboardPage.vue'
import MainContent from '@/ui/layout/MainContent.vue'
import MainLayout from '@/ui/layout/MainLayout.vue'
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

const sections = [
  {
    title: 'Personal Information',
    fields: [
      {
        label: 'Full name',
        value: 'Jane Doe',
      },
      {
        label: 'Email address',
        value: 'jane.doe@example.com',
      },
      {
        label: 'Phone number',
        value: '+1 (555) 000-0000',
      },
      {
        label: 'Date of birth',
        value: 'January 14, 1990',
      },
    ],
  },
  {
    title: 'Work Details',
    fields: [
      {
        label: 'Job title',
        value: 'Product Designer',
      },
      {
        label: 'Department',
        value: 'Design',
      },
      {
        label: 'Location',
        value: 'San Francisco, CA',
      },
      {
        label: 'Start date',
        value: 'March 1, 2021',
      },
    ],
  },
  {
    title: 'Notifications',
    fields: [
      {
        label: 'Email notifications',
        value: 'Enabled',
      },
      {
        label: 'Push notifications',
        value: 'Disabled',
      },
      {
        label: 'Weekly digest',
        value: 'Enabled',
      },
      {
        label: 'Marketing emails',
        value: 'Disabled',
      },
    ],
  },
  {
    title: 'Security',
    fields: [
      {
        label: 'Two-factor authentication',
        value: 'Active',
      },
      {
        label: 'Last password change',
        value: '3 months ago',
      },
      {
        label: 'Active sessions',
        value: '2 devices',
      },
      {
        label: 'Recovery email',
        value: 'recovery@example.com',
      },
    ],
  },
  {
    title: 'Integrations',
    fields: [
      {
        label: 'Slack',
        value: 'Connected',
      },
      {
        label: 'GitHub',
        value: 'Connected',
      },
      {
        label: 'Jira',
        value: 'Not connected',
      },
      {
        label: 'Figma',
        value: 'Connected',
      },
    ],
  },
  {
    title: 'Billing',
    fields: [
      {
        label: 'Plan',
        value: 'Pro',
      },
      {
        label: 'Billing cycle',
        value: 'Monthly',
      },
      {
        label: 'Next invoice',
        value: 'June 1, 2026',
      },
      {
        label: 'Payment method',
        value: 'Visa •••• 4242',
      },
    ],
  },
]
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
              key: 'centered-page-scrollabel-detail-pane',
              strategy: 'localStorage',
            },
            variant: 'bordered-inline',
          }"
          title="Profile"
        >
          <DashboardPageCenteredContentScrollable>
            <DashboardPageCenteredContentHeader
              :left-header-config="{
                type: 'featured-icon',
                icon: Settings01Icon,
              }"
              title="Settings"
            />
            <UIColumnLayout columns="w-full">
              <div
                v-for="section in sections"
                :key="section.title"
                class="w-full rounded-lg border border-secondary p-4xl"
              >
                <h3 class="mb-lg text-sm font-semibold text-primary">
                  {{ section.title }}
                </h3>

                <dl class="grid grid-cols-2 gap-lg">
                  <div
                    v-for="field in section.fields"
                    :key="field.label"
                  >
                    <dt class="text-xs text-tertiary">
                      {{ field.label }}
                    </dt>
                    <dd class="mt-xs text-sm text-primary">
                      {{ field.value }}
                    </dd>
                  </div>
                </dl>
              </div>
            </UIColumnLayout>
          </DashboardPageCenteredContentScrollable>
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
