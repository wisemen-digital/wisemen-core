import type { FieldWrapper } from '@/types/input.type'

export interface FieldWrapperProps extends FieldWrapper {
  /**
   * Whether the input is in an error state.
   * @default false
   */
  isError?: boolean
  /**
   * The size of the input field.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
