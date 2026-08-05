<script setup lang="ts">
import {
  BarChartSquare02Icon,
  CalendarIcon,
  File05Icon,
  LifeBuoy01Icon,
  Rows01Icon,
  Settings01Icon,
} from '@wisemen/vue-core-icons'
import {
  Motion,
  useReducedMotion,
} from 'motion-v'
import {
  computed,
  watch,
} from 'vue'

import { UIButton } from '@/ui/button/index'
import MainSidebarFooterAccountCard from '@/ui/sidebar/components/MainSidebarFooterAccountCard.vue'
import MainSidebarFooterFeaturedCard from '@/ui/sidebar/components/MainSidebarFooterFeaturedCard.vue'
import MainSidebarGlobalSearch from '@/ui/sidebar/components/MainSidebarGlobalSearch.vue'
import MainSidebarHeaderLogoWithText from '@/ui/sidebar/components/MainSidebarHeaderLogoWithText.vue'
import MainSidebarNavigationGroup from '@/ui/sidebar/components/MainSidebarNavigationGroup.vue'
import MainSidebarNavigationLink from '@/ui/sidebar/components/MainSidebarNavigationLink.vue'
import MainSidebarNavigationLinkBadge from '@/ui/sidebar/components/MainSidebarNavigationLinkBadge.vue'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'
import MainSidebar from '@/ui/sidebar/MainSidebar.vue'
import type {
  DashboardSidebarNavLink,
  MainSidebarCollapsedVariant,
} from '@/ui/sidebar/types/mainSidebar.type'

const props = withDefaults(defineProps<{
  collapsedVariant?: MainSidebarCollapsedVariant
}>(), {
  collapsedVariant: 'minified',
})

const {
  isFloatingSidebar,
  isSidebarOpen,
  collapsedVariant: _sidebarCollapsedVariant,
  setCollapsedVariant,
  sidebarWidth,
} = useMainSidebar()

watch(() => props.collapsedVariant, (value) => {
  setCollapsedVariant(value)
}, {
  immediate: true,
})

const isReduceMotionEnabledOnDevice = useReducedMotion()

interface NavigationGroup {
  label: string
  links: DashboardSidebarNavLink[]
}

const navigation = computed<NavigationGroup[]>(() => ([
  {
    label: 'Main',
    links: [
      {
        badge: {
          label: '10',
        },
        icon: BarChartSquare02Icon,
        label: 'Dashboard',
        to: {
          path: '/',
        },
        type: 'link',
      },
      {
        hasStatusDot: true,
        icon: Rows01Icon,
        label: 'Projects',
        to: {
          path: '/projects',
        },
        type: 'link',
      },
      {
        icon: File05Icon,
        label: 'Reports',
        subItems: [
          {
            label: 'Overview',
            to: {
              path: '/reports',
            },
          },
          {
            badge: {
              label: '3',
            },
            label: 'Analytics',
            to: {
              path: '/reports/analytics',
            },
          },
          {
            hasStatusDot: true,
            label: 'Export',
            to: {
              path: '/reports/export',
            },
          },
        ],
        type: 'sub-items',
      },
      {
        icon: CalendarIcon,
        label: 'Archive',
        subItems: [
          {
            label: 'All time',
            to: {
              path: '/archive',
            },
          },
          {
            label: 'This year',
            to: {
              path: '/archive/year',
            },
          },
          {
            label: 'This month',
            to: {
              path: '/archive/month',
            },
          },
          {
            label: 'This week',
            to: {
              path: '/archive/week',
            },
          },
        ],
        type: 'sub-items',
      },
    ],
  },
  {
    label: 'Other',
    links: [
      {
        icon: File05Icon,
        label: 'Documents',
        to: {
          path: '/others',
        },
        type: 'link',
      },
      {
        icon: CalendarIcon,
        label: 'Calendar',
        to: {
          path: '/other-projects',
        },
        type: 'link',
      },
    ],
  },
]))

const footerNavigation = computed<NavigationGroup[]>(() => ([
  {
    label: '',
    links: [
      {
        icon: LifeBuoy01Icon,
        label: 'Support',
        to: {
          path: '/support',
        },
        type: 'link',
      },
      {
        icon: Settings01Icon,
        label: 'Settings',
        to: {
          path: '/test',
        },
        type: 'link',
      },
    ],
  },
]))
</script>

<template>
  <div
    class="
      relative flex h-[80dvh] w-full overflow-hidden rounded-lg border
      border-secondary
    "
  >
    <MainSidebar
      :collapsed-variant="props.collapsedVariant"
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
            :key="link.label"
            v-bind="link"
          >
            <template
              v-if="link.label === 'Documents'"
              #right
            >
              <MainSidebarNavigationLinkBadge label="99+" />
            </template>
          </MainSidebarNavigationLink>
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
            :key="link.label"
            v-bind="link"
          />
        </MainSidebarNavigationGroup>
        <MainSidebarFooterAccountCard
          :actions="[]"
          avatar-url="../../../storybook-assets/profile-picture.jpg"
          name="Jeroen Van Caekenberghe"
          email="jeroen.vancaekenberghe@wisemen.digital"
        />
      </template>
    </MainSidebar>

    <Motion
      :initial="{
        paddingLeft: props.collapsedVariant === 'minified' ? !isFloatingSidebar ? sidebarWidth : '0' : isSidebarOpen && !isFloatingSidebar ? sidebarWidth : '0',
      }"
      :animate="{
        paddingLeft: props.collapsedVariant === 'minified' ? !isFloatingSidebar ? sidebarWidth : '0' : isSidebarOpen && !isFloatingSidebar ? sidebarWidth : '0',
      }"
      :transition="{
        duration: isReduceMotionEnabledOnDevice ? 0 : 0.3,
        type: 'spring',
        bounce: 0,
      }"
      class="size-full"
    >
      <div class="h-full bg-secondary p-xl">
        <UIButton
          :label="isSidebarOpen ? 'Close sidebar' : 'Open sidebar'"
          @click="() => isSidebarOpen = !isSidebarOpen"
        />
      </div>
    </Motion>
  </div>
</template>
