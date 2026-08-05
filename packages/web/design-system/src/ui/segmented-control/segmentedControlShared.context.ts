import type {
  ComputedRef,
  Ref,
} from 'vue'

export interface SegmentedControlSharedContext<TModelValue, TStyle> {
  hasDescription: ComputedRef<boolean>
  isDescriptionCentered: ComputedRef<boolean>
  isDisabled: ComputedRef<boolean>
  modelValue: Ref<TModelValue>
  orientation: ComputedRef<'horizontal' | 'vertical'>
  registerItem: (hasDescription: boolean) => void
  unregisterItem: (hasDescription: boolean) => void
  variants: ComputedRef<TStyle>
}
