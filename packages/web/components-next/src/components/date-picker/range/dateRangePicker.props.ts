import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { SharedDatePickerProps } from '@/components/date-picker/shared/sharedDatePicker.props'

export interface DateRangePickerProps extends SharedDatePickerProps, CustomizableElement<'dateRangePicker'> {
  /**
   * When combined with isDateUnavailable, determines whether non-contiguous ranges,
   * i.e. ranges containing unavailable dates, may be selected.
   * @default false
   */
  allowNonContinuousSelection?: boolean
  /**
   * The visual style of the date range picker.
   */
  variant?: GetComponentProp<'dateRangePicker', 'variant'> | null
}
