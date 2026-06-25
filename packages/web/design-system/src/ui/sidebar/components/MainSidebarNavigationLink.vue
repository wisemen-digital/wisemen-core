<script setup lang="ts">
import type { Component } from 'vue'
import { computed } from 'vue'
import type {
  RouteLocationNormalized,
  RouteLocationRaw,
} from 'vue-router'
import {
  useRoute,
  useRouter,
} from 'vue-router'

import type { KeyboardShortcut } from '@/ui/keyboard-shortcut/keyboardShortcut.type'
import MainSidebarNavigationLinkButton from '@/ui/sidebar/components/MainSidebarNavigationLinkButton.vue'
import MainSidebarNavigationLinkCollapsible from '@/ui/sidebar/components/MainSidebarNavigationLinkCollapsible.vue'
import MainSidebarNavigationLinkPopover from '@/ui/sidebar/components/MainSidebarNavigationLinkPopover.vue'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'

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

function onLinkClick(): void {
  closeIfFloatingSidebar()
  emit('click')
}
</script>

<template>
  <MainSidebarNavigationLinkPopover
    v-if="usePopover"
    v-model:is-popover-open="isPopoverOpen"
    :icon="props.icon"
    :is-parent-active="isParentActive"
    :label="props.label"
    :sub-items="props.subItems!"
  />

  <MainSidebarNavigationLinkCollapsible
    v-else-if="hasSubItems"
    :icon="props.icon"
    :is-parent-active="isParentActive"
    :is-tooltip-disabled="isTooltipDisabled"
    :keyboard-shortcut="props.keyboardShortcut"
    :label="props.label"
    :sub-items="props.subItems!"
  />

  <MainSidebarNavigationLinkButton
    v-else
    :icon="props.icon"
    :is-active="props.isActive"
    :is-tooltip-disabled="isTooltipDisabled"
    :keyboard-shortcut="props.keyboardShortcut"
    :label="props.label"
    :to="props.to!"
    @click="onLinkClick"
  >
    <template #right>
      <slot name="right" />
    </template>
  </MainSidebarNavigationLinkButton>
</template>
