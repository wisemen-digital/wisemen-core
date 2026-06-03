import { useContext } from '@/composables/context.composable'

interface TableGroupContext {
  isGroup: boolean
}

export const [
  useProvideTableGroupContext,
  useInjectTableGroupContext,
] = useContext<TableGroupContext>('tableGroupContext')
