import type { Temporal } from 'temporal-polyfill'

export interface DatePickerProps {
  /**
   * The maximum selectable date.
   * @default null
   */
  maxDate?: Temporal.PlainDate | null
  /**
   * The minimum selectable date.
   * @default null
   */
  minDate?: Temporal.PlainDate | null
}
