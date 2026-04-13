import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { Icon } from '@/icons/icons'
import type {
  FormElement,
  InteractableElement,
  TestId,
} from '@/utils/props.util'

export interface NumberFieldProps extends TestId, InteractableElement, FormElement, CustomizableElement<'numberField'> {
  /**
   * Whether the input is loading.
   * @default false
   */
  isLoading?: boolean
  /**
   * The autocomplete property of the input.
   * @default 'off'
   */
  autocomplete?: 'off' | 'on'
  /**
   * Specifies formatting options for the number input, using `Intl.NumberFormatOptions`.
   * This controls how the number is displayed (e.g., decimal places, currency, or percentage).
   * When `null`, no formatting is applied.
   * @default null
   */
  formatOptions?: Intl.NumberFormatOptions | null
  /**
   * Determines whether the number input should display increment and decrement controls.
   * When `true`, buttons for increasing and decreasing the value will be hidden.
   * @default false
   */
  hideControls?: boolean
  /**
   * The icon displayed on the left side of the input. If set to null, no icon will be shown.
   * @default null
   */
  iconLeft?: Icon | null
  /**
   * The icon displayed on the right side of the input. If set to null, no icon will be shown.
   * @default null
   */
  iconRight?: Icon | null
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
   * The placeholder text of the input.
   * @default null
   */
  placeholder?: string | null
  /**
   * Defines the increment and decrement step for the number input.
   * This determines how much the value changes when using controls or arrow keys.
   * @default 1
   */
  step?: number
  /**
   * Defines the visual style of the number input.
   */
  variant?: GetComponentProp<'numberField', 'variant'> | null
}
