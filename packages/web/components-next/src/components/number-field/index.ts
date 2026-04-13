import type { NumberFieldProps } from '@/components/number-field/numberField.props'

export type VcNumberFieldProps = Omit<NumberFieldProps, 'classConfig' | 'variant'>
export { createNumberFieldStyle } from '@/components/number-field/numberField.style'
export { default as VcNumberField } from '@/components/number-field/NumberField.vue'
export { default as VcNumberFieldDecrement } from '@/components/number-field/parts/NumberFieldDecrement.vue'
export { default as VcNumberFieldIconLeft } from '@/components/number-field/parts/NumberFieldIconLeft.vue'
export { default as VcNumberFieldIconRight } from '@/components/number-field/parts/NumberFieldIconRight.vue'
export { default as VcNumberFieldIncrement } from '@/components/number-field/parts/NumberFieldIncrement.vue'
export { default as VcNumberFieldInput } from '@/components/number-field/parts/NumberFieldInput.vue'
export { default as VcNumberFieldLoader } from '@/components/number-field/parts/NumberFieldLoader.vue'
export { default as VcNumberFieldRoot } from '@/components/number-field/parts/NumberFieldRoot.vue'
