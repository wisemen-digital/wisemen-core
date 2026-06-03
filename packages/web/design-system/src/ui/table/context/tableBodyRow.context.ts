import type { ComputedRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

import { useContext } from '@/composables/context.composable'

interface TableBodyRowContext {
  link: ComputedRef<RouteLocationRaw | null>
}

export const [
  useProvideTableBodyRowContext,
  useInjectTableBodyRowContext,
] = useContext<TableBodyRowContext>('tableBodyRowContext')
