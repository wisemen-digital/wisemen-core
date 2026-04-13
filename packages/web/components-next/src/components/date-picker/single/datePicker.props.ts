import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { SharedDatePickerProps } from '@/components/date-picker/shared/sharedDatePicker.props'

export interface DatePickerProps extends SharedDatePickerProps, CustomizableElement<'datePicker'> {
  /**
   * Defines the visual style of the date picker.
   */
  variant?: GetComponentProp<'datePicker', 'variant'> | null
}
