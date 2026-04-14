import type {
  ComputedRef,
  Ref,
} from 'vue'

import { useContext } from '@/composables/context.composable'

export interface DetailPaneContext {
  isFloatingDetailPane: ComputedRef<boolean>
  isOpen: Ref<boolean>
  isResizable: boolean
  isResizing: Ref<boolean>
  sidebarWidth: Ref<string>
  toggleIsOpen: () => void
  onResizeKeyDown: (event: KeyboardEvent) => void
  onResizeStart: (event: PointerEvent) => void
}

export const [
  useProvideDetailPaneContext,
  useInjectDetailPaneContext,
] = useContext<DetailPaneContext>('DetailPaneContext')
