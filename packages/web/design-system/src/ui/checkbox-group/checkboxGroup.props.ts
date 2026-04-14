import type { DisabledWithReason } from '@/types/disabledWithReason.type'

export interface CheckboxGroupProps extends DisabledWithReason {
  /**
   * Controls the keyboard navigation direction of the checkbox group.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical'

}
