import type {
  ComputedRef,
  Ref,
} from 'vue'

import { useContext } from '@/composables/context.composable'

export interface MainContentDetailPaneContext {
  hasDetailPane: Ref<boolean>
  isOpen: ComputedRef<boolean>
  isToggleHidden: Ref<boolean>
  registerDetailPane: (isOpen: Ref<boolean>, toggle: () => void, isToggleHidden?: boolean) => void
  toggle: () => void
  unregisterDetailPane: () => void
}

export const [
  useProvideMainContentDetailPaneContext,
  useInjectMainContentDetailPaneContext,
] = useContext<MainContentDetailPaneContext>('MainContentDetailPaneContext')
