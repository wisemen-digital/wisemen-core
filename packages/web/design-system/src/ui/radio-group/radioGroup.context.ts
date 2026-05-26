import type { AcceptableValue } from 'reka-ui'
import type {
  ComputedRef,
  Ref,
} from 'vue'

import { useContext } from '@/composables/context.composable'

interface RadioGroupContext {
  isDisabled: ComputedRef<boolean>
  modelValue: Ref<AcceptableValue>
  orientation: ComputedRef<'horizontal' | 'vertical'>
}

export const [
  useProvideRadioGroupContext,
  useInjectRadioGroupContext,
] = useContext<RadioGroupContext>('radioGroupContext')
