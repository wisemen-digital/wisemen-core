<script setup lang="ts">
import { TabsRoot as RekaTabsRoot } from 'reka-ui'
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import { toComputedRefs } from '@/composables/context.composable'
import { useTabs } from '@/ui/tabs/tabs.composable'
import { useProvideTabsContext } from '@/ui/tabs/tabs.context'
import type { TabsProps } from '@/ui/tabs/tabs.props'
import type { TabsVariants } from '@/ui/tabs/tabs.style'
import { tabsVariants } from '@/ui/tabs/tabs.style'
import { useAdaptiveTabs } from '@/ui/tabs/tabsAdaptive.composable'
import { isTouchDevice } from '@/utils/isTouchDevice.util'

const props = withDefaults(defineProps<TabsProps>(), {
  isFullWidth: false,
  orientation: 'horizontal',
  variant: 'underline',
})

const isTouch = isTouchDevice()

const modelValue = defineModel<string>({
  required: true,
})

const {
  hasHorizontalOverflow,
  hasReachedHorizontalEnd,
  isScrolledHorizontally,
  scrollToActiveTab,
  scrollToLeft,
  scrollToRight,
  setScrollContainerRef,
} = useTabs({
  activeValue: computed<string>(() => modelValue.value),
})

const adaptiveDropdownRef = ref<HTMLDivElement | null>(null)

function setAdaptiveDropdownRef(el: HTMLDivElement | null): void {
  adaptiveDropdownRef.value = el
}

function getAdaptiveDropdownRef(): HTMLDivElement | null {
  return adaptiveDropdownRef.value
}

const variants = computed<TabsVariants>(() => tabsVariants({
  isFullWidth: props.isFullWidth,
  variant: props.variant,
}))

onMounted(() => {
  scrollToActiveTab()
})

const {
  activeTab,
  registerTab,
  tabs,
  unregisterTab,
} = useAdaptiveTabs(computed<string | null>(() => modelValue.value))

useProvideTabsContext({
  ...toComputedRefs(props),
  hasHorizontalOverflow,
  hasReachedHorizontalEnd,
  isScrolledHorizontally,
  isTouchDevice: isTouch,
  activeTab,
  getAdaptiveDropdownRef,
  registerTab,
  scrollToLeft,
  scrollToRight,
  setAdaptiveDropdownRef,
  setScrollContainerRef,
  tabs,
  unregisterTab,
  variants,
})
</script>

<template>
  <RekaTabsRoot
    v-model="modelValue"
    :orientation="props.orientation"
  >
    <slot />
  </RekaTabsRoot>
</template>
