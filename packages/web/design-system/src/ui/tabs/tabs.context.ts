import type { ComputedRef } from 'vue'

import type { PropsToComputed } from '@/composables/context.composable'
import { useContext } from '@/composables/context.composable'
import type { TabsProps } from '@/ui/tabs/tabs.props'
import type { TabsVariants } from '@/ui/tabs/tabs.style'

interface TabsContext extends PropsToComputed<TabsProps> {
  hasHorizontalOverflow: ComputedRef<boolean>
  hasReachedHorizontalEnd: ComputedRef<boolean>
  isScrolledHorizontally: ComputedRef<boolean>
  isTouchDevice: boolean
  scrollToLeft: () => void
  scrollToRight: () => void
  setScrollContainerRef: (ref: HTMLElement) => void
  variants: ComputedRef<TabsVariants>
}

export const [
  useProvideTabsContext,
  useInjectTabsContext,
] = useContext<TabsContext>('tabsContext')
