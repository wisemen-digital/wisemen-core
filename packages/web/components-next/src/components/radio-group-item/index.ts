import type { RadioGroupItemProps } from '@/components/radio-group-item/radioGroupItem.props'

export { default as VcRadioGroupItemControl } from '@/components/radio-group-item/parts/RadioGroupItemControl.vue'
export { default as VcRadioGroupItemIndicator } from '@/components/radio-group-item/parts/RadioGroupItemIndicator.vue'
export { default as VcRadioGroupItemRoot } from '@/components/radio-group-item/parts/RadioGroupItemRoot.vue'
export type VcRadioGroupItemProps = Omit<RadioGroupItemProps, 'classConfig' | 'variant'>
export { default as VcRadioGroupItem } from '@/components/radio-group-item/RadioGroupItem.vue'
