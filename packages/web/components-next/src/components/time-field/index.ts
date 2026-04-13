import type { TimeFieldProps } from '@/components/time-field/timeField.props'

export { default as VcTimeFieldIconLeft } from '@/components/time-field/parts/TimeFieldIconLeft.vue'
export { default as VcTimeFieldInput } from '@/components/time-field/parts/TimeFieldInput.vue'
export { default as VcTimeFieldLoader } from '@/components/time-field/parts/TimeFieldLoader.vue'
export { default as VcTimeFieldRoot } from '@/components/time-field/parts/TimeFieldRoot.vue'
export type VcTimeFieldProps = Omit<TimeFieldProps, 'classConfig' | 'variant'>
export { default as VcTimeField } from '@/components/time-field/TimeField.vue'
