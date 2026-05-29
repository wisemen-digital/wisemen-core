import type { ShallowRef } from 'vue'

import { useContext } from '@/composables/context.composable'

export const [
  useProvideTableScrollContainerContext,
  useInjectTableScrollContainerContext,
] = useContext<ShallowRef<HTMLElement | null>>('tableScrollContainerContext')
