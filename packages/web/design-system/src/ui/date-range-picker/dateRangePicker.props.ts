import type { PlainDate } from '@wisemen/vue-core-dates'

export interface DateRangePickerProps {
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
   * Whether to show the presets sidebar.
   * @default true
   */
  showPresets?: boolean
}
