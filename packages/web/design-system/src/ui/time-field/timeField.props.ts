import type {
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface TimeFieldProps extends Input, InputWrapper, FieldWrapper {
  /**
   * The size of the time field.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
