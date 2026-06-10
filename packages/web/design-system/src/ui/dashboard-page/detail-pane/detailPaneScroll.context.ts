import type { Ref } from 'vue'

import { useContext } from '@/composables/context.composable'

export interface DetailPaneScrollContext {
  hasTabs: Ref<boolean>
  isScrolledToBottom: Ref<boolean>
  isScrolledToTop: Ref<boolean>
  bodyRef: Ref<HTMLElement | null>

}

export const [
  useProvideDetailPaneScrollContext,
  useInjectDetailPaneScrollContext,
] = useContext<DetailPaneScrollContext>('DetailPaneScrollContext')
