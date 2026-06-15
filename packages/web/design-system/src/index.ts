import './source.css'
import './utilities.css'

export * from './locales'
export type { Register } from './register'
export { type HourCycle } from './types/hourCycle.type'
export {
  getLocaleFromNumberFormat, type NumberFormat,
} from './types/numberFormat.type'
export * from './ui'
export { createComponent } from './utils/createComponent.util'
export { toFormField } from './utils/toFormField.util'
export { useInput } from '@/composables/input.composable'
export { useNumberFormat } from '@/composables/numberFormat.composable'
export {
  type Sort, type SortDirection, type SortValue, useSort,
} from '@/composables/sort.composable'
export { useIsReducedMotion } from '@/composables/useIsReducedMotion.composable'
export { tv } from '@/libs/tailwindVariants.lib'
export {
  type AutocompleteInput, type FieldWrapper,
  type Input, INPUT_DEFAULTS, INPUT_FIELD_DEFAULTS, INPUT_META_DEFAULTS, type InputWrapper,
} from '@/types/input.type'
