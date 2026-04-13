import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'

interface MainSidebarNavigationLinkContext {
  isActive: ComputedRef<boolean>
}

export const [
  useProvideMainSidebarNavigationLinkContext,
  useInjectMainSidebarNavigationLinkContext,
] = useContext<MainSidebarNavigationLinkContext>('MainSidebarNavigationLinkContextKey')
