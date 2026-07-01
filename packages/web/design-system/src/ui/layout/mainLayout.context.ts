import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import { useContext } from '@/composables/context.composable'

export type MainLayoutVariant = 'branded' | 'default'

interface MainLayoutContext {
  variant: ComputedRef<MainLayoutVariant>
}

const [
  useProvideMainLayoutContext,
  useInjectMainLayoutContextBase,
] = useContext<MainLayoutContext>('mainLayoutContext')

export { useProvideMainLayoutContext }

export function useInjectMainLayoutContext(): MainLayoutContext {
  return useInjectMainLayoutContextBase(null) ?? {
    variant: computed<MainLayoutVariant>(() => 'default'),
  }
}
