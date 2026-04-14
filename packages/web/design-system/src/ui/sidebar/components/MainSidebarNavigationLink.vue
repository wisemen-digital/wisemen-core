<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import type {
  RouteLocationNormalized,
  RouteLocationRaw,
} from 'vue-router'
import {
  RouterLink,
  useRoute,
} from 'vue-router'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import MainSidebarFadeTransition from '@/ui/sidebar/components/MainSidebarFadeTransition.vue'
import MainSidebarNavigationLinkProvider from '@/ui/sidebar/components/MainSidebarNavigationLinkProvider.vue'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'

export interface Props {
  isActive?: (route: RouteLocationNormalized) => boolean
  icon: Component
  keyboardShortcut?: string | null
  label: string
  to: RouteLocationRaw
}

const props = withDefaults(defineProps<Props>(), {
  isActive: () => false,
  keyboardShortcut: null,
})

const emit = defineEmits<{
  click: []
}>()

const {
  isSidebarOpen,
  closeIfFloatingSidebar,
  collapsedVariant,
  sidebarIconCellSize,
  sidebarIconSize,
  sidebarLinkHeight,
} = useMainSidebar()

const route = useRoute()

function onClick(): void {
  closeIfFloatingSidebar()
  emit('click')
}

const navigationLinkGridTemplateColumns = `${sidebarIconCellSize} 1fr`

const isTooltipDisabled = computed<boolean>(() => {
  if (collapsedVariant.value === 'hidden' && props.keyboardShortcut === null) {
    return true
  }

  if (collapsedVariant.value === 'minified' && isSidebarOpen && props.keyboardShortcut === null) {
    return true
  }

  return false
})
</script>

<template>
  <ActionTooltip
    :is-disabled="isTooltipDisabled"
    :keyboard-shortcut="props.keyboardShortcut"
    :label="props.label"
    popover-side="right"
  >
    <ClickableElement>
      <RouterLink
        v-slot="{ isActive: isRouteActive }"
        :to="props.to"
        class="w-full"
        @click="onClick"
      >
        <MainSidebarNavigationLinkProvider
          :is-active="isRouteActive"
        >
          <div
            :data-active="isRouteActive || props.isActive(route) || undefined"
            :style="{
              height: sidebarLinkHeight,
              gridTemplateColumns: navigationLinkGridTemplateColumns,
            }"
            class="
              group grid rounded-md duration-100
              hover:bg-primary-hover
              data-active:bg-brand-primary
              dark:data-active:bg-tertiary
            "
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
                    truncate text-xs font-medium text-secondary duration-100
                    group-hover:text-primary
                    group-data-active:text-brand-secondary
                  "
                >
                  {{ props.label }}
                </span>
                <RowLayout
                  gap="lg"
                  align="center"
                  class="shrink-0"
                >
                  <slot name="right" />
                </RowLayout>
              </RowLayout>
            </MainSidebarFadeTransition>
          </div>
        </MainSidebarNavigationLinkProvider>
      </RouterLink>
    </ClickableElement>
  </ActionTooltip>
</template>
