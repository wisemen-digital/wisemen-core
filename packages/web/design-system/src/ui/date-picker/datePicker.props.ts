import type { Temporal } from 'temporal-polyfill'

import type {
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface DatePickerProps extends Input, InputWrapper, FieldWrapper {
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
   * The placeholder text shown when no date is selected.
   *
   * @default null
   */
  placeholder?: string | null
  /**
   * The size of the date picker trigger.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
