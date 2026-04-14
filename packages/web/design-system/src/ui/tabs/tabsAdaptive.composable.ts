import type { ComputedRef } from 'vue'
import {
  computed,
  shallowRef,
} from 'vue'

import type { TabItemData } from '@/ui/tabs/tabs.context'
import type { TabsItemProps } from '@/ui/tabs/tabs.props'

export function useAdaptiveTabs(activeValue: ComputedRef<string | null>) {
  let priorityCounter = 0

  function nextPriority(): number {
    return priorityCounter++
  }

  const tabs = shallowRef<TabItemData[]>([])

  const activeTab = computed<TabItemData | null>(() => {
    return tabs.value.find((tab) => tab.value === activeValue.value) ?? null
  })

  function registerTab(tab: TabsItemProps): number {
    const priority = nextPriority()

    tabs.value = [
      ...tabs.value,
      {
        ...tab,
        priority,
      },
    ]

    return priority
  }

  function unregisterTab(value: string): void {
    tabs.value = tabs.value.filter((tab) => tab.value !== value)
  }

  return {
    activeTab,
    registerTab,
    tabs,
    unregisterTab,
  }
}
