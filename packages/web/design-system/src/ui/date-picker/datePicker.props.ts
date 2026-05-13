import type { PlainDate } from '@wisemen/vue-core-dates'

export interface DatePickerProps {
  /**
   * The maximum selectable date.
   * @default null
   */
  maxDate?: PlainDate | null
  /**
   * The minimum selectable date.
   * @default null
   */
  minDate?: PlainDate | null
  /**
   * Whether or not to always display 6 weeks in the calendar.
   * This can be useful to prevent layout shifting.
   * @default false
   */
  fixedWeeks?: boolean
  /**
   * The size of the date picker.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
