import type {
  Component,
  ComputedRef,
} from 'vue'

import type { PropsToComputed } from '@/composables/context.composable'
import { useContext } from '@/composables/context.composable'
import type { TabsProps } from '@/ui/tabs/tabs.props'
import type { TabsVariants } from '@/ui/tabs/tabs.style'

export interface TabsOverflowTabData {
  id: string
  isDisabled: boolean
  isLabelHidden?: boolean
  count: number | null
  disabledReason: string | null
  icon?: Component
  label: string
  order: number
  value: string
}

interface TabsContext extends PropsToComputed<TabsProps> {
  hasHorizontalOverflow: ComputedRef<boolean>
  hasReachedHorizontalEnd: ComputedRef<boolean>
  isResponsiveOverflowEnabled: ComputedRef<boolean>
  isScrolledHorizontally: ComputedRef<boolean>
  isTabVisible: (tabId: string) => boolean
  isTouchDevice: boolean
  activeValue: ComputedRef<string | null>
  overflowTabs: ComputedRef<TabsOverflowTabData[]>
  registeredTabs: ComputedRef<TabsOverflowTabData[]>
  registerTab: (tab: Omit<TabsOverflowTabData, 'order'>) => void
  scrollToLeft: () => void
  scrollToRight: () => void
  setOverflowContainerRef: (ref: HTMLElement | null) => void
  setOverflowMeasurementDropdownTriggerRef: (ref: HTMLElement | null) => void
  setOverflowMeasurementListRef: (ref: HTMLElement | null) => void
  setOverflowMeasurementTabRef: (tabId: string, ref: HTMLElement | null) => void
  setScrollContainerRef: (ref: HTMLElement) => void
  unregisterTab: (tabId: string) => void
  updateTab: (tab: Omit<TabsOverflowTabData, 'order'>) => void
  variants: ComputedRef<TabsVariants>
}

export const [
  useProvideTabsContext,
  useInjectTabsContext,
] = useContext<TabsContext>('tabsContext')
