import type { TextFieldProps } from '@/components/text-field/textField.props'

export { default as VcTextFieldIconLeft } from '@/components/text-field/parts/TextFieldIconLeft.vue'
export { default as VcTextFieldIconRight } from '@/components/text-field/parts/TextFieldIconRight.vue'
export { default as VcTextFieldInput } from '@/components/text-field/parts/TextFieldInput.vue'
export { default as VcTextFieldLoader } from '@/components/text-field/parts/TextFieldLoader.vue'
export { default as VcTextFieldRoot } from '@/components/text-field/parts/TextFieldRoot.vue'
export type VcTextFieldProps = Omit<TextFieldProps, 'classConfig' | 'variant'>
export { createTextFieldStyle } from '@/components/text-field/textField.style'
export { default as VcTextField } from '@/components/text-field/TextField.vue'
