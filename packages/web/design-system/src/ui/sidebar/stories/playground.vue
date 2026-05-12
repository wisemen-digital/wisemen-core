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
import type { Component } from 'vue'
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
import MainSidebarNavigationLinkStatusDot from '@/ui/sidebar/components/MainSidebarNavigationLinkStatusDot.vue'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'
import MainSidebar from '@/ui/sidebar/MainSidebar.vue'
import type { MainSidebarCollapsedVariant } from '@/ui/sidebar/types/mainSidebar.type'

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

export interface NavigationGroup {
  label: string
  links: NavigationItem[]
}
export interface NavigationItem {
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
          path: '/others',
        },
      },
      {
        name: 'Calendar',
        icon: CalendarIcon,
        to: {
          path: '/other-projects',
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
          path: '/test',
        },
      },
    ],
  },
]))
</script>

<template>
  <div
    class="
      relative flex h-[80dvh] w-full overflow-hidden rounded-lg border
      border-primary
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
            :key="link.name"
            :to="link.to"
            :icon="link.icon"
            :label="link.name"
          >
            <template #right>
              <MainSidebarNavigationLinkBadge
                label="10"
              />
              <MainSidebarNavigationLinkStatusDot />
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
          :on-sign-out="() => {}"
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
