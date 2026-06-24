<script setup lang="ts">
import { ChevronDownIcon } from '@wisemen/vue-core-icons'
import {
  CollapsibleContent as RekaCollapsibleContent,
  CollapsibleRoot as RekaCollapsibleRoot,
  HoverCardContent as RekaHoverCardContent,
  HoverCardPortal as RekaHoverCardPortal,
  HoverCardRoot as RekaHoverCardRoot,
  HoverCardTrigger as RekaHoverCardTrigger,
} from 'reka-ui'
import type { Component } from 'vue'
import {
  computed,
  ref,
} from 'vue'
import type {
  RouteLocationNormalized,
  RouteLocationRaw,
} from 'vue-router'
import {
  RouterLink,
  useRoute,
  useRouter,
} from 'vue-router'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import ClickableElement from '@/ui/clickable-element/ClickableElement.vue'
import type { KeyboardShortcut } from '@/ui/keyboard-shortcut/keyboardShortcut.type'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import MainSidebarFadeTransition from '@/ui/sidebar/components/MainSidebarFadeTransition.vue'
import MainSidebarNavigationLinkProvider from '@/ui/sidebar/components/MainSidebarNavigationLinkProvider.vue'
import MainSidebarNavigationSubItem from '@/ui/sidebar/components/MainSidebarNavigationSubItem.vue'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'
import ThemeProvider from '@/ui/theme-provider/ThemeProvider.vue'

export interface Props {
  isActive?: (route: RouteLocationNormalized) => boolean
  icon: Component
  keyboardShortcut?: KeyboardShortcut | null
  label: string
  subItems?: {
    label: string
    to: RouteLocationRaw
  }[]
  to?: RouteLocationRaw
}

const props = withDefaults(defineProps<Props>(), {
  isActive: () => false,
  keyboardShortcut: null,
  subItems: undefined,
  to: undefined,
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
const router = useRouter()

const hasSubItems = computed<boolean>(() =>
  (props.subItems?.length ?? 0) > 0)

const usePopover = computed<boolean>(() =>
  hasSubItems.value && !isSidebarOpen.value)

const isParentActive = computed<boolean>(() => {
  if (props.isActive?.(route)) {
    return true
  }

  return props.subItems?.some((sub) => {
    const resolved = router.resolve(sub.to)

    if (resolved.name != null && resolved.name === route.name) {
      return true
    }

    return resolved.path !== '/' && route.path.startsWith(resolved.path)
  }) ?? false
})

const isPopoverOpen = defineModel<boolean>('isPopoverOpen', {
  default: false,
})

const isCollapsibleOpen = ref<boolean>(false)

function onLinkClick(): void {
  closeIfFloatingSidebar()
  emit('click')
}

const navigationLinkGridTemplateColumns = `${sidebarIconCellSize} 1fr`

const isTooltipDisabled = computed<boolean>(() => {
  if (usePopover.value) {
    return true
  }

  if (collapsedVariant.value === 'hidden' && props.keyboardShortcut === null) {
    return true
  }

  if (collapsedVariant.value === 'minified' && isSidebarOpen.value && props.keyboardShortcut === null) {
    return true
  }

  return false
})
</script>

<template>
  <MainSidebarNavigationLinkProvider
    v-if="usePopover"
    :is-active="isParentActive"
  >
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
            @click="isPopoverOpen = !isPopoverOpen"
            @keydown.enter.prevent="isPopoverOpen = !isPopoverOpen"
            @keydown.space.prevent="isPopoverOpen = !isPopoverOpen"
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

  <RekaCollapsibleRoot
    v-else-if="hasSubItems"
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
        <MainSidebarNavigationLinkProvider
          :is-active="isParentActive"
        >
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
        overflow-hidden
        data-[state=closed]:animate-collapsible-up
        data-[state=open]:animate-collapsible-down
      "
    >
      <div class="flex flex-col gap-xs pt-xs">
        <MainSidebarNavigationSubItem
          v-for="subItem in props.subItems"
          :key="subItem.label"
          :label="subItem.label"
          :to="subItem.to"
        />
      </div>
    </RekaCollapsibleContent>
  </RekaCollapsibleRoot>

  <ActionTooltip
    v-else
    :is-disabled="isTooltipDisabled"
    :keyboard-shortcut="props.keyboardShortcut"
    :label="props.label"
    popover-side="right"
  >
    <ClickableElement>
      <RouterLink
        v-slot="{ isActive: isRouteActive }"
        :to="props.to!"
        class="w-full"
        @click="onLinkClick"
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
              hover:bg-fg-primary/4
              data-active:bg-fg-primary/4
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
                    truncate text-xs font-medium whitespace-nowrap
                    text-secondary duration-100
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
