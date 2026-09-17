export { default as WuiCalendarWeekView } from './CalendarWeekView.vue'
export type { CalendarEvent } from './types/calendarEvent.type'
export type { CalendarWeekViewProps as WuiCalendarWeekViewProps } from './types/calendarWeekView.props'
export {
  getNextWeekDate,
  getPreviousWeekDate,
  getTodayDate,
} from './utils/calendarWeekViewNavigation.util'
