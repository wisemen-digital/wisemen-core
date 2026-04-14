import type {
  ComputedRef,
  Ref,
} from 'vue'

import type { PropsToComputed } from '@/composables/context.composable'
import { useContext } from '@/composables/context.composable'
import type {
  TabsItemProps,
  TabsProps,
} from '@/ui/tabs/tabs.props'
import type { TabsVariants } from '@/ui/tabs/tabs.style'

export interface TabItemData extends TabsItemProps {
  priority: number
}

interface TabsContext extends PropsToComputed<TabsProps> {
  hasHorizontalOverflow: ComputedRef<boolean>
  hasReachedHorizontalEnd: ComputedRef<boolean>
  isScrolledHorizontally: ComputedRef<boolean>
  isTouchDevice: boolean
  activeTab: ComputedRef<TabItemData | null>
  getAdaptiveDropdownRef: () => InstanceType<typeof HTMLDivElement> | null
  registerTab: (tab: TabsItemProps) => number
  scrollToLeft: () => void
  scrollToRight: () => void
  setAdaptiveDropdownRef: (el: InstanceType<typeof HTMLDivElement> | null) => void
  setScrollContainerRef: (ref: HTMLElement) => void
  tabs: Ref<TabItemData[]>
  unregisterTab: (value: string) => void
  variants: ComputedRef<TabsVariants>

}

export const [
  useProvideTabsContext,
  useInjectTabsContext,
] = useContext<TabsContext>('tabsContext')
