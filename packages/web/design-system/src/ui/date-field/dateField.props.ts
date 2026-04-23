import type { Temporal } from 'temporal-polyfill'

import type {
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface DateFieldProps extends Input, InputWrapper, FieldWrapper {
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
   * Whether to hide the calendar picker trigger.
   * @default false
   */
  isPickerHidden?: boolean
  /**
   * The size of the date field.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
