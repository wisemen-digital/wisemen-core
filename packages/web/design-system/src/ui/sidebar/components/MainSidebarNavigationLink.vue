<script setup lang="ts">
import { computed } from 'vue'
import {
  useRoute,
  useRouter,
} from 'vue-router'

import MainSidebarNavigationLinkButton from '@/ui/sidebar/components/MainSidebarNavigationLinkButton.vue'
import MainSidebarNavigationLinkCollapsible from '@/ui/sidebar/components/MainSidebarNavigationLinkCollapsible.vue'
import MainSidebarNavigationLinkPopover from '@/ui/sidebar/components/MainSidebarNavigationLinkPopover.vue'
import { useMainSidebar } from '@/ui/sidebar/mainSidebar.composable'
import type {
  DashboardSidebarNavLink,
  SidebarNavLeafItem,
  SidebarNavParentItem,
} from '@/ui/sidebar/types/mainSidebar.type'

export type Props = DashboardSidebarNavLink

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
} = useMainSidebar()

const route = useRoute()
const router = useRouter()

const parentProps = computed<SidebarNavParentItem | null>(() =>
  props.type === 'sub-items' ? props as SidebarNavParentItem : null)

const leafProps = computed<SidebarNavLeafItem | null>(() =>
  props.type === 'link' ? props as SidebarNavLeafItem : null)

const hasSubItems = computed<boolean>(() => props.type === 'sub-items')

const usePopover = computed<boolean>(() =>
  hasSubItems.value && !isSidebarOpen.value)

const isParentActive = computed<boolean>(() => {
  if (props.isActive?.(route)) {
    return true
  }

  return parentProps.value?.subItems.some((sub) => {
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
    v-if="usePopover && parentProps !== null"
    v-model:is-popover-open="isPopoverOpen"
    :icon="props.icon"
    :is-parent-active="isParentActive"
    :label="props.label"
    :sub-items="parentProps.subItems"
  />

  <MainSidebarNavigationLinkCollapsible
    v-else-if="hasSubItems && parentProps !== null"
    :icon="props.icon"
    :is-parent-active="isParentActive"
    :is-tooltip-disabled="isTooltipDisabled"
    :keyboard-shortcut="props.keyboardShortcut"
    :label="props.label"
    :sub-items="parentProps.subItems"
  />

  <MainSidebarNavigationLinkButton
    v-else-if="leafProps !== null"
    :icon="props.icon"
    :is-active="props.isActive"
    :is-tooltip-disabled="isTooltipDisabled"
    :keyboard-shortcut="props.keyboardShortcut"
    :label="props.label"
    :to="leafProps.to"
    @click="onLinkClick"
  >
    <template #right>
      <slot name="right" />
    </template>
  </MainSidebarNavigationLinkButton>
</template>
