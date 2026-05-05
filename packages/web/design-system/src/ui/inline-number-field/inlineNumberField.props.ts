import type {
  AutocompleteInput,
  FieldWrapper,
  InlineField,
  Input,
} from '@/types/input.type'

export interface InlineNumberFieldProps extends Input, AutocompleteInput, FieldWrapper, InlineField {
  /**
   * Specifies formatting options for the number input, using `Intl.NumberFormatOptions`.
   * @default null
   */
  formatOptions?: Intl.NumberFormatOptions | null
  /**
   * The maximum value.
   * @default null
   */
  max?: number | null
  /**
   * The minimum value.
   * @default null
   */
  min?: number | null
  /**
   * The size of the number field.
   * @default 'md'
   */
  size?: 'md' | 'sm' | 'xs'
  /**
   * Defines the increment/decrement step for arrow key and scroll interactions.
   * @default 1
   */
  step?: number
}
