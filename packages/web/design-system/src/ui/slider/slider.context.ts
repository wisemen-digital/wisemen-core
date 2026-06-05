import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { SliderStyle } from '@/ui/slider/slider.style'

interface SliderContext {
  isDisabled: ComputedRef<boolean>
  showValueLabels: ComputedRef<boolean>
  size: ComputedRef<'sm' | 'md'>
  sliderStyle: ComputedRef<SliderStyle>
}

export const [
  useProvideSliderContext,
  useInjectSliderContext,
] = useContext<SliderContext>('sliderContext')
