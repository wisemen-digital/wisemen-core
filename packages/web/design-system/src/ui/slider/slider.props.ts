import type {
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface SliderProps extends Input, InputWrapper {
  /**
   * The minimum value for the range.
   * @default 0
   */
  min?: number
  /**
   * The maximum value for the range.
   * @default 100
   */
  max?: number
  /**
   * The stepping interval.
   * @default 1
   */
  step?: number
  /**
   * The minimum permitted steps between multiple thumbs. Useful for range sliders.
   * @default 0
   */
  minStepsBetweenThumbs?: number
  /**
   * Whether to show value labels below each thumb.
   * @default false
   */
  showValueLabels?: boolean
  /**
   * The size of the slider track and thumb.
   * @default 'md'
   */
  size?: 'sm' | 'md'
}
