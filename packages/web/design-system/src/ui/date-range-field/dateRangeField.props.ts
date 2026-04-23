import type { Temporal } from 'temporal-polyfill'

import type {
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface DateRangeFieldProps extends Input, InputWrapper, FieldWrapper {
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
   * The placeholder text shown when no date range is selected.
   *
   * @default null
   */
  placeholder?: string | null
  /**
   * Whether to hide the calendar picker trigger.
   * @default false
   */
  isPickerHidden?: boolean
  /**
   * The size of the date range picker trigger.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
