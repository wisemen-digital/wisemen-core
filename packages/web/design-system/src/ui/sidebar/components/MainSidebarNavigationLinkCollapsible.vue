<script setup lang="ts">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import {
  CollapsibleContent as RekaCollapsibleContent,
  CollapsibleRoot as RekaCollapsibleRoot,
} from 'reka-ui'
import type { Component } from 'vue'
import {
  ref,
  watch,
} from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import type { KeyboardShortcut } from '@/ui/keyboard-shortcut/keyboardShortcut.type'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import MainSidebarFadeTransition from '@/ui/sidebar/components/MainSidebarFadeTransition.vue'
import MainSidebarNavigationLinkProvider from '@/ui/sidebar/components/MainSidebarNavigationLinkProvider.vue'
import MainSidebarNavigationSubItem from '@/ui/sidebar/components/MainSidebarNavigationSubItem.vue'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'

interface Props {
  isParentActive: boolean
  isTooltipDisabled: boolean
  icon: Component
  keyboardShortcut?: KeyboardShortcut | null
  label: string
  subItems: {
    label: string
    to: RouteLocationRaw
  }[]
}

const props = defineProps<Props>()

const isCollapsibleOpen = ref<boolean>(true)

const {
  isSidebarOpen,
  collapsedVariant,
  sidebarIconCellSize,
  sidebarIconSize,
  sidebarLinkHeight,
} = useMainSidebar()

watch(() => props.isParentActive, (isParentActive) => {
  if (isParentActive) {
    isCollapsibleOpen.value = true
  }
})

const navigationLinkGridTemplateColumns = `${sidebarIconCellSize} 1fr`
</script>

<template>
  <RekaCollapsibleRoot
    v-model:open="isCollapsibleOpen"
    class="w-full"
  >
    <ActionTooltip
      :is-disabled="isTooltipDisabled"
      :keyboard-shortcut="props.keyboardShortcut"
      :label="props.label"
      popover-side="right"
    >
      <ClickableElement>
        <MainSidebarNavigationLinkProvider :is-active="isParentActive">
          <button
            :style="{
              height: sidebarLinkHeight,
              gridTemplateColumns: navigationLinkGridTemplateColumns,
            }"
            type="button"
            class="
              group grid w-full rounded-md duration-100
              hover:bg-fg-primary/4
            "
            @click="isCollapsibleOpen = !isCollapsibleOpen"
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
                class="shrink-0 text-fg-quaternary duration-100"
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
                  "
                >
                  {{ props.label }}
                </span>
                <ChevronDownIcon
                  :class="{ 'rotate-180': isCollapsibleOpen }"
                  class="size-3.5 shrink-0 text-fg-quaternary duration-150"
                />
              </RowLayout>
            </MainSidebarFadeTransition>
          </button>
        </MainSidebarNavigationLinkProvider>
      </ClickableElement>
    </ActionTooltip>

    <RekaCollapsibleContent
      class="
        data-[state=closed]:animate-collapsible-up
        data-[state=open]:animate-collapsible-down
        overflow-hidden
      "
    >
      <div
        :style="{
          marginLeft: `calc(${sidebarIconCellSize} / 2)`,
        }"
        class="mt-xs flex flex-col gap-xs border-l border-secondary pl-xs"
      >
        <MainSidebarNavigationSubItem
          v-for="subItem in props.subItems"
          :key="subItem.label"
          :label="subItem.label"
          :to="subItem.to"
        />
      </div>
    </RekaCollapsibleContent>
  </RekaCollapsibleRoot>
</template>
