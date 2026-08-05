import type { ComputedRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { useContext } from '@/composables/context.composable'

interface TableBodyRowContext {
  link: ComputedRef<RouteLocationRaw | null>
  onClick: ComputedRef<(() => void) | null>
}

export const [
  useProvideTableBodyRowContext,
  useInjectTableBodyRowContext,
] = useContext<TableBodyRowContext>('tableBodyRowContext')
