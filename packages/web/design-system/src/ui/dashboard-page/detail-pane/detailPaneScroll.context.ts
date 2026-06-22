import type { Ref } from 'vue'

import { useContext } from '@/composables/context.composable'

export interface DetailPaneScrollContext {
  hasTabs: Ref<boolean>
}

export const [
  useProvideDetailPaneScrollContext,
  useInjectDetailPaneScrollContext,
] = useContext<DetailPaneScrollContext>('DetailPaneScrollContext')
