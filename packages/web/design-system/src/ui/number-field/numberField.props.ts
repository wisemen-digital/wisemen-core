import type {
  AutocompleteInput,
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface NumberFieldProps extends Input, AutocompleteInput, InputWrapper, FieldWrapper {
  /**
   * Specifies formatting options for the number input, using `Intl.NumberFormatOptions`.
   * This controls how the number is displayed (e.g., decimal places, currency, or percentage).
   * When `null`, no formatting is applied.
   * @default null
   */
  formatOptions?: Intl.NumberFormatOptions | null
  /**
   * The maximum value of the number input.
   * @default null
   */
  max?: number | null
  /**
   * The minimum value of the number input.
   * @default null
   */
  min?: number | null
  /**
   * Determines whether the number input should display increment and decrement controls.
   * When `true`, buttons for increasing and decreasing the value will be hidden.
   * @default false
   */
  showControls?: boolean
  /**
   * Defines the increment and decrement step for the number input.
   * This determines how much the value changes when using controls or arrow keys.
   * @default 1
   */
  step?: number
}
