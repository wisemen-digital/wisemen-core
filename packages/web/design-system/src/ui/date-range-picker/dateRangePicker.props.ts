import type { Temporal } from 'temporal-polyfill'

export interface DateRangePickerProps {
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
  /**
   * Whether to show the presets sidebar.
   * @default true
   */
  showPresets?: boolean
}

export interface DateRangePickerRange {
  end: Temporal.PlainDate | null
  start: Temporal.PlainDate | null
}
