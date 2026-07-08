import type { PlainDate } from '@wisemen/vue-core-dates'

import type {
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'
import type { DayConfig } from '@/ui/date-field/dateField.type'

export interface DateRangeFieldProps extends Input, InputWrapper, FieldWrapper {
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
   * Whether to hide the calendar picker trigger.
   * @default false
   */
  isPickerHidden?: boolean
  /**
   * Returns a config to decorate a given calendar day (e.g. a colored dot for a birthday or holiday).
   * Called once per rendered day. Return `null` for days that shouldn't be decorated.
   */
  getDayConfig?: (date: PlainDate) => DayConfig | null
  /**
   * The placeholder text shown when no date range is selected.
   *
   * @default null
   */
  placeholder?: string | null
  /**
   * The size of the date range picker trigger.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
