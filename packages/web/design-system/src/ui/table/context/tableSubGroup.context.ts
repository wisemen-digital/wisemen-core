import { useContext } from '@/composables/context.composable'

interface TableSubGroupContext {
  isSubGroup: boolean
}

export const [
  useProvideTableSubGroupContext,
  useInjectTableSubGroupContext,
] = useContext<TableSubGroupContext>('tableSubGroupContext')
