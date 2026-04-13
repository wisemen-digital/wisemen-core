import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { Icon } from '@/icons/icons'
import type { SharedDateProps } from '@/types/shareDateProps.type'
import type {
  FormElement,
  InteractableElement,
  TestId,
} from '@/utils/props.util'

export interface DateRangeFieldProps extends TestId, InteractableElement, FormElement, SharedDateProps, CustomizableElement<'dateRangeField'> {
  /**
   * Whether the input is loading.
   * @default false
   */
  isLoading?: boolean
  /**
   * When combined with isDateUnavailable, determines whether non-contiguous ranges,
   * i.e. ranges containing unavailable dates, may be selected.
   * @default false
   */
  allowNonContinuousSelection?: boolean
  /**
   * The autocomplete property of the input.
   * @default 'off'
   */
  autocomplete?: 'off' | 'on'
  /**
   * Whether the picker should remain open after a selection is made.
   * @default false
   */
  dontCloseOnSelect?: boolean
  /**
   * Hides the date picker dropdown trigger when set to `true`.
   *
   * @default false
   */
  hideDatePicker?: boolean
  /**
   * The icon displayed on the left side of the input. If set to null, no icon will be shown.
   * @default null
   */
  iconLeft?: Icon | null
  /**
   * Defines the visual style of the date field.
   */
  variant?: GetComponentProp<'dateField', 'variant'> | null
}
