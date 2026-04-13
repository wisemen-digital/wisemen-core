import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context/context.composable'

interface LayoutStackContext {
  addToStack: (layoutId: string) => void
  getDepth: (layoutId: string) => number
  removeFromStack: (layoutId: string) => void
  stack: ComputedRef<string[]>
}

export const [
  useProvideLayoutStackContext,
  useInjectLayoutStackContext,
] = useContext<LayoutStackContext>('layoutStackContext')
