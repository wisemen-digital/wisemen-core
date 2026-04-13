import type {
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface RadioGroupProps extends Input, InputWrapper {
  /**
   * Controls the keyboard navigation direction of the radio group.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical'
}
