import { useContext } from '@/composables/context/context.composable'

interface SelectGroupContext {
  id: string
  labelId: string
}

export const [
  useProvideSelectGroupContext,
  useInjectSelectGroupContext,
] = useContext<SelectGroupContext>('selectGroupContext')
