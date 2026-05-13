import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { BaseCheckboxStyle } from '@/ui/checkbox/base/baseCheckbox.style'

interface CheckboxContext {
  isIndeterminate: ComputedRef<boolean>
  checkboxStyle: ComputedRef<BaseCheckboxStyle>
}

export const [
  useProvideCheckboxContext,
  useInjectCheckboxContext,
] = useContext<CheckboxContext>('checkboxContext')
