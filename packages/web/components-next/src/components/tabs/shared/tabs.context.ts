import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { TabsProps } from '@/components/tabs/shared/tabs.props'
import type { CreateTabsStyle } from '@/components/tabs/shared/tabs.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface TabsContext extends PropsToComputed<TabsProps> {
  hasHorizontalOverflow: ComputedRef<boolean>
  hasReachedHorizontalEnd: ComputedRef<boolean>
  isScrolledHorizontally: ComputedRef<boolean>
  customClassConfig: ComputedRef<ResolvedClassConfig<'tabs'>>
  scrollToLeft: () => void
  scrollToRight: () => void
  setScrollContainerRef: (ref: HTMLElement) => void
  style: ComputedRef<CreateTabsStyle>
}

export const [
  useProvideTabsContext,
  useInjectTabsContext,
] = useContext<TabsContext>('tabsContext')
