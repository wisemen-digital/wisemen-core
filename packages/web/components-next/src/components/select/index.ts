import type {
  SelectItemProps,
  SelectProps,
  SelectValue,
} from '@/components/select/select.props'

export { default as VcSelectBase } from '@/components/select/parts/SelectBase.vue'
export { default as VcSelectBaseMultiple } from '@/components/select/parts/SelectBaseMultiple.vue'
export { default as VcSelectBaseSingle } from '@/components/select/parts/SelectBaseSingle.vue'
export { default as VcSelectItem } from '@/components/select/parts/SelectItem.vue'
export { default as VcSelectItemIndicator } from '@/components/select/parts/SelectItemIndicator.vue'
export type VcSelectItemProps = SelectItemProps
export type VcSelectProps<TValue extends SelectValue = SelectValue> = Omit<SelectProps<TValue>, 'classConfig' | 'variant'>
export { default as VcSelect } from '@/components/select/Select.vue'
export { createSelectStyle } from '@/components/select/style/select.style'
