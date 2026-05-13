import type { AcceptableValue } from 'reka-ui'
import type {
  ComputedRef,
  Ref,
} from 'vue'

import { useContext } from '@/composables/context.composable'

interface CheckboxGroupContext {
  isDisabled: ComputedRef<boolean>
  isIndeterminate: ComputedRef<boolean>
  modelValue: Ref<AcceptableValue[]>
  orientation: ComputedRef<'horizontal' | 'vertical'>
  registerCheckbox: (id: string, value: AcceptableValue) => void
  toggleAll: () => void
  unRegisterCheckbox: (id: string) => void
}

export const [
  useProvideCheckboxGroupContext,
  useInjectCheckboxGroupContext,
] = useContext<CheckboxGroupContext>('checkboxGroupContext')
