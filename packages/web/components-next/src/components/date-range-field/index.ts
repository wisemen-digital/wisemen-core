import type { DateRangeFieldProps } from '@/components/date-range-field/dateRangeField.props'

export type VcDateRangeFieldProps = Omit<DateRangeFieldProps, 'classConfig' | 'variant'>
export { createDateRangeFieldStyle } from '@/components/date-range-field/dateRangeField.style'
export { default as VcDateRangeField } from '@/components/date-range-field/DateRangeField.vue'
export { default as VcDateRangeFieldIconLeft } from '@/components/date-range-field/parts/DateRangeFieldIconLeft.vue'
export { default as VcDateRangeFieldInput } from '@/components/date-range-field/parts/DateRangeFieldInput.vue'
export { default as VcDateRangeFieldLoader } from '@/components/date-range-field/parts/DateRangeFieldLoader.vue'
export { default as VcDateRangefieldPopover } from '@/components/date-range-field/parts/DateRangefieldPopover.vue'
export { default as VcDateRangeFieldRoot } from '@/components/date-range-field/parts/DateRangeFieldRoot.vue'
