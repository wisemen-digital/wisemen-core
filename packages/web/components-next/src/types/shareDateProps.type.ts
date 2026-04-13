import type { Temporal } from 'temporal-polyfill'

export interface SharedDateProps {
  /**
   * The latest selectable date.
   * @default null
   */
  maxDate?: Temporal.PlainDate | null
  /**
   * The earliest selectable date.
   * @default null
   */
  minDate?: Temporal.PlainDate | null
  /**
   * The day the week starts on, where 0 represents Sunday, 1 represents Monday, and so on up to 6 for Saturday.
   * @default 0
   */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /**
   * A function to determine whether a specific date should be disabled.
   *
   * A date that is restricted by rules or settings, such as blackout dates, min/max date limits,
   * or days that should never be selectable (e.g., weekends in a work calendar).
   * These dates are predefined as unselectable, regardless of external availability.
   *
   * @param date - The date to check.
   * @returns `true` if the date should be disabled, `false` otherwise.
   * @default () => false
   */
  isDateDisabled?: (date: Temporal.PlainDate) => boolean
  /**
   * A function to determine whether a specific date is unavailable.
   *
   * A date that is not selectable because it is already booked, occupied, or reserved based on external data
   * (e.g., a hotel booking system showing fully booked days). The user sees these dates but cannot pick them.
   *
   * @param date - The date to check.
   * @returns `true` if the date is unavailable, `false` otherwise.
   * @default () => false
   */
  isDateUnavailable?: (date: Temporal.PlainDate) => boolean
  /**
   * Whether selecting an already selected date should deselect it.
   * @default false
   */
  allowDeselect?: boolean
  /**
   * The locale to use for date formatting and calendar display.
   * If not provided, the component will use the browser's default locale.
   * @default undefined
   */
  locale?: string
  /**
   * Whether the calendar should display two months instead of one.
   * @default false
   */
  showTwoMonths?: boolean
}
