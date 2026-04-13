import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { AdaptiveContentBlock } from '@/ui/adaptive-content/adaptiveContent.type'

interface AdaptiveContentContext {
  registerBlock: (block: AdaptiveContentBlock) => void
  scheduleLayoutEvaluation: () => void
  unregisterBlock: (id: string) => void
  visibleBlockIds: ComputedRef<Set<string>>
}

export const [
  useProvideAdaptiveContentContext,
  useInjectAdaptiveContentContext,
] = useContext<AdaptiveContentContext>('adaptiveContentContext')
