<script setup lang="ts">
import {
  computed,
  onMounted,
} from 'vue'
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
  SidebarNavLinkItem,
  SidebarNavSubItemsItem,
} from '@/ui/sidebar/types/mainSidebar.type'

export type Props = DashboardSidebarNavLink

const props = withDefaults(defineProps<Props>(), {
  isActive: () => false,
  keyboardShortcut: null,
  type: 'link',
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

const hasSubItems = computed<boolean>(() => props.type === 'sub-items')

const subItemsProps = computed<SidebarNavSubItemsItem | null>(() =>
  isSubItemsProps(props) ? props : null)

const linkProps = computed<SidebarNavLinkItem | null>(() =>
  isSubItemsProps(props) ? null : props)

const usePopover = computed<boolean>(() =>
  hasSubItems.value && !isSidebarOpen.value)

const isSubItemsActive = computed<boolean>(() => {
  if (props.isActive?.(route)) {
    return true
  }

  return subItemsProps.value?.subItems.some((sub) => {
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

function isSubItemsProps(item: DashboardSidebarNavLink): item is SidebarNavSubItemsItem {
  return item.type === 'sub-items'
}

onMounted(() => {
  if (!isSubItemsProps(props) && 'subItems' in props && props.subItems != null) {
    console.warn(
      '[MainSidebarNavigationLink] Received `subItems` but `type` is missing or set to \'link\'. '
      + 'Set `type: \'sub-items\'` to render this item as an expandable group.',
    )
  }
})
</script>

<template>
  <MainSidebarNavigationLinkPopover
    v-if="usePopover && subItemsProps !== null"
    v-model:is-popover-open="isPopoverOpen"
    :icon="props.icon"
    :is-sub-items-active="isSubItemsActive"
    :label="props.label"
    :sub-items="subItemsProps.subItems"
  />

  <MainSidebarNavigationLinkCollapsible
    v-else-if="hasSubItems && subItemsProps !== null"
    :icon="props.icon"
    :is-sub-items-active="isSubItemsActive"
    :is-tooltip-disabled="isTooltipDisabled"
    :keyboard-shortcut="props.keyboardShortcut"
    :label="props.label"
    :sub-items="subItemsProps.subItems"
  />

  <MainSidebarNavigationLinkButton
    v-else-if="linkProps !== null"
    :icon="props.icon"
    :is-active="props.isActive"
    :is-tooltip-disabled="isTooltipDisabled"
    :keyboard-shortcut="props.keyboardShortcut"
    :label="props.label"
    :to="linkProps.to"
    @click="onLinkClick"
  >
    <template #right>
      <slot name="right" />
    </template>
  </MainSidebarNavigationLinkButton>
</template>
