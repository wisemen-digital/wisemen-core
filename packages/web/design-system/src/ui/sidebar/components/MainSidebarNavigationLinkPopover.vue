<script setup lang="ts">
import {
  HoverCardContent as RekaHoverCardContent,
  HoverCardPortal as RekaHoverCardPortal,
  HoverCardRoot as RekaHoverCardRoot,
  HoverCardTrigger as RekaHoverCardTrigger,
} from 'reka-ui'
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import MainSidebarFadeTransition from '@/ui/sidebar/components/MainSidebarFadeTransition.vue'
import MainSidebarNavigationLinkProvider from '@/ui/sidebar/components/MainSidebarNavigationLinkProvider.vue'
import MainSidebarNavigationSubItem from '@/ui/sidebar/components/MainSidebarNavigationSubItem.vue'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

interface Props {
  isParentActive: boolean
  icon: Component
  label: string
  subItems: {
    label: string
    to: RouteLocationRaw
  }[]
}

const props = defineProps<Props>()

const isPopoverOpen = defineModel<boolean>('isPopoverOpen', {
  default: false,
})

const {
  isSidebarOpen,
  collapsedVariant,
  sidebarIconCellSize,
  sidebarIconSize,
  sidebarLinkHeight,
} = useMainSidebar()

const navigationLinkGridTemplateColumns = `${sidebarIconCellSize} 1fr`

function togglePopover(): void {
  isPopoverOpen.value = !isPopoverOpen.value
}
</script>

<template>
  <MainSidebarNavigationLinkProvider :is-active="isParentActive">
    <RekaHoverCardRoot
      v-model:open="isPopoverOpen"
      :open-delay="150"
      :close-delay="150"
    >
      <RekaHoverCardTrigger :as-child="true">
        <ClickableElement>
          <button
            :data-active="isParentActive || undefined"
            :style="{
              height: sidebarLinkHeight,
              gridTemplateColumns: navigationLinkGridTemplateColumns,
            }"
            type="button"
            class="
              group grid w-full rounded-md duration-100
              hover:bg-fg-primary/4
              data-active:bg-fg-primary/4
            "
            @click="togglePopover()"
            @keydown.enter.prevent="togglePopover()"
            @keydown.space.prevent="togglePopover()"
          >
            <RowLayout
              :style="{
                width: sidebarIconCellSize,
                height: sidebarIconCellSize,
              }"
              align="center"
              justify="center"
            >
              <Component
                :is="props.icon"
                :style="{
                  width: sidebarIconSize,
                  height: sidebarIconSize,
                }"
                class="
                  shrink-0 text-fg-quaternary duration-100
                  group-data-active:text-fg-brand-primary
                  dark:group-data-active:text-fg-primary
                "
              />
            </RowLayout>

            <MainSidebarFadeTransition>
              <RowLayout
                v-if="collapsedVariant !== 'minified' || isSidebarOpen"
                align="center"
                justify="between"
                gap="md"
                class="overflow-hidden pr-md"
              >
                <span
                  class="
                    truncate text-xs font-medium whitespace-nowrap
                    text-secondary duration-100
                    group-hover:text-primary
                    group-data-active:text-brand-secondary
                  "
                >
                  {{ props.label }}
                </span>
              </RowLayout>
            </MainSidebarFadeTransition>
          </button>
        </ClickableElement>
      </RekaHoverCardTrigger>

      <RekaHoverCardPortal to="body">
        <ThemeProvider :as-child="true">
          <RekaHoverCardContent
            :side-offset="4"
            align="start"
            data-animation="sidebar-hover-card"
            side="right"
            position-strategy="absolute"
            sticky="always"
            class="
              z-50 origin-(--reka-hover-card-content-transform-origin)
              will-change-[transform,opacity]
            "
          >
            <div
              class="
                relative overflow-hidden rounded-md border border-secondary
                bg-primary shadow-lg
              "
            >
              <div class="flex min-w-36 flex-col gap-xs p-xs">
                <MainSidebarNavigationSubItem
                  v-for="subItem in props.subItems"
                  :key="subItem.label"
                  :label="subItem.label"
                  :to="subItem.to"
                  no-indent
                  @click="isPopoverOpen = false"
                />
              </div>
            </div>
          </RekaHoverCardContent>
        </ThemeProvider>
      </RekaHoverCardPortal>
    </RekaHoverCardRoot>
  </MainSidebarNavigationLinkProvider>
</template>
