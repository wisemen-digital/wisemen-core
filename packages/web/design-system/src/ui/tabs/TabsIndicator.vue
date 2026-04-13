<script setup lang="ts">
import { TabsIndicator as RekaTabsIndicator } from 'reka-ui'
import {
  computed,
  onBeforeUnmount,
  ref,
  watch,
} from 'vue'

import type { TabItemData } from '@/ui/tabs/tabs.context'
import { useInjectTabsContext } from '@/ui/tabs/tabs.context'

const props = defineProps<{
  hiddenTabsCount: number
  tabs: TabItemData[]
}>()

const {
  activeTab,
  getAdaptiveDropdownRef,
  variants,
} = useInjectTabsContext()

const indicatorRef = ref<InstanceType<typeof RekaTabsIndicator> | null>(null)

const hiddenTabs = computed<TabItemData[]>(
  () => [
    ...props.tabs,
  ].slice(-props.hiddenTabsCount),
)

const isActiveTabHidden = computed<boolean>(
  () => hiddenTabs.value.some((tab) => tab.value === activeTab.value?.value),
)

let styleObserver: MutationObserver | null = null
let isApplying = false

function applyDropdownIndicatorStyle(indicatorEl: HTMLElement): void {
  const dropdownEl = getAdaptiveDropdownRef()

  if (!dropdownEl) {
    return
  }

  isApplying = true
  indicatorEl.style.setProperty('--reka-tabs-indicator-position', `${dropdownEl.offsetLeft}px`)
  indicatorEl.style.setProperty('--reka-tabs-indicator-size', `${dropdownEl.offsetWidth}px`)
  isApplying = false
}

function stopObserver(): void {
  styleObserver?.disconnect()
  styleObserver = null
}

watch(isActiveTabHidden, (isHidden) => {
  if (!isHidden) {
    stopObserver()
  }
})

watch(activeTab, () => {
  stopObserver()

  if (props.hiddenTabsCount > 0 && isActiveTabHidden.value) {
    const indicatorEl = indicatorRef.value?.$el as HTMLElement | undefined

    if (!indicatorEl) {
      return
    }

    styleObserver = new MutationObserver(() => {
      if (isApplying) {
        return
      }

      applyDropdownIndicatorStyle(indicatorEl)
    })

    styleObserver.observe(indicatorEl, {
      attributeFilter: [
        'style',
      ],
      attributes: true,
    })

    applyDropdownIndicatorStyle(indicatorEl)
  }
})

onBeforeUnmount(() => {
  stopObserver()
})
</script>

<template>
  <RekaTabsIndicator
    ref="indicatorRef"
    :class="variants.indicator()"
  >
    <div :class="variants.indicatorInner()" />
  </RekaTabsIndicator>
</template>
