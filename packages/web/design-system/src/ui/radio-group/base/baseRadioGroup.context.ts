import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { BaseRadioGroupStyle } from '@/ui/radio-group/base/baseRadioGroup.style'

interface RadioGroupItemContext {
  radioGroupStyle: ComputedRef<BaseRadioGroupStyle>
}

export const [
  useProvideRadioGroupItemContext,
  useInjectRadioGroupItemContext,
] = useContext<RadioGroupItemContext>('radioGroupItemContext')
