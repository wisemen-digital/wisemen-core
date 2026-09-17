import type { Temporal } from 'temporal-polyfill'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'

export interface CalendarWeekViewProps<TMeta = Record<string, unknown>> {
  currentDate: Temporal.PlainDate
  /**
   * @default 24
   */
  endHour?: number
  events: CalendarEvent<TMeta>[]
  /**
   * @default 1
   */
  firstDayOfWeek?: 0 | 1
  /**
   * @default 0
   */
  startHour?: number
}
