<script setup lang="ts">
import { TabsRoot as RekaTabsRoot } from 'reka-ui'
import {
  computed,
  onMounted,
} from 'vue'
import {
  useRoute,
  useRouter,
} from 'vue-router'

import { toComputedRefs } from '@/composables/context.composable'
import { useTabs } from '@/ui/tabs/tabs.composable'
import { useProvideTabsContext } from '@/ui/tabs/tabs.context'
import type { TabsProps } from '@/ui/tabs/tabs.props'
import type { TabsVariants } from '@/ui/tabs/tabs.style'
import { tabsVariants } from '@/ui/tabs/tabs.style'
import { useTabsOverflow } from '@/ui/tabs/tabsOverflow.composable'
import { isTouchDevice } from '@/utils/isTouchDevice.util'

import TabsList from './TabsList.vue'

const props = withDefaults(defineProps<TabsProps>(), {
  isFullWidth: false,
  orientation: 'horizontal',
  overflowBehavior: 'responsive-dropdown',
  underlineTabsHorizontalListPadding: 'none',
  variant: 'underline',
})

if (props.underlineTabsHorizontalListPadding !== 'none' && props.variant !== 'underline') {
  console.warn('[TabsRouterLink] `underlineTabsHorizontalListPadding` only applies to the `underline` variant.')
}

const route = useRoute()
const router = useRouter()
const isTouch = isTouchDevice()
const activeRouteName = computed<string>(() =>
  route.name as string)
const isResponsiveOverflowEnabled = computed<boolean>(() =>
  props.overflowBehavior === 'responsive-dropdown'
  && props.orientation === 'horizontal'
  && !props.isFullWidth
  && !isTouch)

function onUpdateModelValue(value: string): void {
  if (value !== activeRouteName.value) {
    router.replace({
      name: value,
    })
  }
}

const {
  hasHorizontalOverflow,
  hasReachedHorizontalEnd,
  isScrolledHorizontally,
  scrollToActiveTab,
  scrollToLeft,
  scrollToRight,
  setScrollContainerRef,
} = useTabs({
  activeValue: activeRouteName,
})

const {
  isTabVisible,
  overflowTabs,
  registeredTabs,
  registerTab,
  setOverflowContainerRef,
  setOverflowMeasurementDropdownTriggerRef,
  setOverflowMeasurementListRef,
  setOverflowMeasurementTabRef,
  unregisterTab,
  updateTab,
} = useTabsOverflow({
  isEnabled: isResponsiveOverflowEnabled,
  activeValue: activeRouteName,
})

const variants = computed<TabsVariants>(() => tabsVariants({
  isFullWidth: props.isFullWidth,
  underlineTabsHorizontalListPadding: props.underlineTabsHorizontalListPadding,
  variant: props.variant,
}))

onMounted(() => {
  scrollToActiveTab()
})

useProvideTabsContext({
  isTouchDevice: isTouch,
  activeValue: activeRouteName,
  ...toComputedRefs(props),
  hasHorizontalOverflow,
  hasReachedHorizontalEnd,
  isResponsiveOverflowEnabled,
  isScrolledHorizontally,
  isTabVisible,
  overflowTabs,
  registeredTabs,
  registerTab,
  scrollToLeft,
  scrollToRight,
  setOverflowContainerRef,
  setOverflowMeasurementDropdownTriggerRef,
  setOverflowMeasurementListRef,
  setOverflowMeasurementTabRef,
  setScrollContainerRef,
  unregisterTab,
  updateTab,
  variants,
})
</script>

<template>
  <RekaTabsRoot
    :model-value="activeRouteName"
    :orientation="props.orientation"
    @update:model-value="onUpdateModelValue"
  >
    <TabsList>
      <slot />
    </TabsList>
  </RekaTabsRoot>
</template>
