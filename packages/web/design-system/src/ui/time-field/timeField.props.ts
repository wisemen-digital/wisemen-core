import type { DateStep } from 'node_modules/reka-ui/dist/index3'

import type {
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface TimeFieldProps extends Input, Omit<InputWrapper, 'placeholder'>, FieldWrapper {
  /**
   * The granularity to use for formatting and inputting times.
   * Determines which time segments are displayed and editable.
   * - `'hour'` — shows hours only
   * - `'minute'` — shows hours and minutes
   * - `'second'` — shows hours, minutes, and seconds
   * @default 'minute'
   */
  granularity?: 'hour' | 'minute' | 'second'
  /**
   * The size of the time field.
   * @default 'md'
   */
  size?: 'md' | 'sm'
  /**
   * The stepping interval for each time segment.
   * Defines the increment applied when using the arrow keys or spinner controls.
   * For example, a step of `{ minute: 15 }` increments minutes in 15-minute intervals.
   * Pass `null` to apply the default of 1.
   */
  step?: DateStep | null
  /**
   * Whether to snap the value to the nearest step increment after the user finishes input.
   * When `true`, any manually typed value is rounded to the closest valid step.
   * @default false
   */
  stepSnapping?: boolean
}
