import type {
  ComputedRef,
  Ref,
} from 'vue'

import { useContext } from '@/composables/context.composable'
import type { DetailPaneVariant } from '@/ui/page/detailPane.type'

export interface DetailPaneContext {
  isFloatingDetailPane: ComputedRef<boolean>
  isOpen: Ref<boolean>
  isResizable: boolean
  isResizing: Ref<boolean>
  sidebarWidth: Ref<string>
  toggleIsOpen: () => void
  variant: DetailPaneVariant
  onResizeKeyDown: (event: KeyboardEvent) => void
  onResizeStart: (event: PointerEvent) => void
}

export const [
  useProvideDetailPaneContext,
  useInjectDetailPaneContext,
] = useContext<DetailPaneContext>('DetailPaneContext')
