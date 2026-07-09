import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import { useContext } from '@/composables/context.composable'

export type MainLayoutVariant = 'branded' | 'default'

interface MainLayoutContext {
  isBrandedActive: ComputedRef<boolean>
  variant: ComputedRef<MainLayoutVariant>
}

const [
  useProvideMainLayoutContext,
  useInjectMainLayoutContextBase,
] = useContext<MainLayoutContext>('mainLayoutContext')

export { useProvideMainLayoutContext }

export function useInjectMainLayoutContext(): MainLayoutContext {
  return useInjectMainLayoutContextBase(null) ?? {
    isBrandedActive: computed<boolean>(() => false),
    variant: computed<MainLayoutVariant>(() => 'default'),
  }
}
