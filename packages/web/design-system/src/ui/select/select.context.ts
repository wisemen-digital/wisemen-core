import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { SelectProps } from '@/ui/select/select.props'

interface SelectContext {
  size: ComputedRef<SelectProps<any>['size']>
  onSelectOption: () => void
}

export const [
  useProvideSelectContext,
  useInjectSelectContext,
] = useContext<SelectContext>('selectContext')
