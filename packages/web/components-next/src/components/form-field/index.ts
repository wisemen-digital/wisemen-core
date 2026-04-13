import type { FormFieldProps } from '@/components/form-field/formField.props'

export type VcFormFieldProps = Omit<FormFieldProps, 'classConfig' | 'variant'>
export { createFormFieldStyle } from '@/components/form-field/formField.style'
export { default as VcFormField } from '@/components/form-field/FormField.vue'
export { default as VcFormFieldError } from '@/components/form-field/parts/FormFieldError.vue'
export { default as VcFormFieldHint } from '@/components/form-field/parts/FormFieldHint.vue'
export { default as VcFormFieldLabel } from '@/components/form-field/parts/FormFieldLabel.vue'
export { default as VcFormFieldRoot } from '@/components/form-field/parts/FormFieldRoot.vue'
