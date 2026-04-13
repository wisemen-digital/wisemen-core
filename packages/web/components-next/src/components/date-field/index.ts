import type { DateFieldProps } from '@/components/date-field/dateField.props'

export type VcDateFieldProps = Omit<DateFieldProps, 'classConfig' | 'variant'>
export { createDateFieldStyle } from '@/components/date-field/dateField.style'
export { default as VcDateField } from '@/components/date-field/DateField.vue'
export { default as VcDateFieldIconLeft } from '@/components/date-field/parts/DateFieldIconLeft.vue'
export { default as VcDateFieldInput } from '@/components/date-field/parts/DateFieldInput.vue'
export { default as VcDateFieldLoader } from '@/components/date-field/parts/DateFieldLoader.vue'
export { default as VcDateFieldPopover } from '@/components/date-field/parts/DateFieldPopover.vue'
export { default as VcDateFieldRoot } from '@/components/date-field/parts/DateFieldRoot.vue'
