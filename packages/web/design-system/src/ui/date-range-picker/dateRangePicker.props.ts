import type { PlainDate } from '@wisemen/vue-core-dates'

import type { DayConfig } from '@/ui/date-field/dateField.type'

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
   * Returns a config to decorate a given calendar day (e.g. a colored dot for a birthday or holiday).
   * Called once per rendered day. Return `null` for days that shouldn't be decorated.
   */
  getDayConfig?: (date: PlainDate) => DayConfig | null
  /**
   * Whether to show the presets sidebar.
   * @default true
   */
  hasPresets?: boolean

  /**
   * @deprecated Use `hasPresets` instead.
   */
  showPresets?: boolean
}
