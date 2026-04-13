import type { CheckboxProps } from '@/components/checkbox/checkbox.props'

export type VcCheckboxProps = Omit<CheckboxProps, 'classConfig' | 'variant'>
export { default as VcCheckbox } from '@/components/checkbox/Checkbox.vue'
export { default as VcCheckboxControl } from '@/components/checkbox/parts/CheckboxControl.vue'
export { default as VcCheckboxIndicator } from '@/components/checkbox/parts/CheckboxIndicator.vue'
export { default as VcCheckboxRoot } from '@/components/checkbox/parts/CheckboxRoot.vue'
