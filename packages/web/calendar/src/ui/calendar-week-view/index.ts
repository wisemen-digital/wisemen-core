export { default as WuiCalendarWeekView } from './CalendarWeekView.vue'
export type { CalendarEvent } from './types/calendarEvent.type'
export type {
  CalendarInteractions,
  CalendarProposedUpdate,
  CalendarSlotDraft,
  CalendarSlotInfo,
  CalendarUpdateResult,
  CalendarUpdateSource,
} from './types/calendarInteraction.type'
export type { CalendarSegment } from './types/calendarSegment.type'
export type { CalendarWeekViewProps as WuiCalendarWeekViewProps } from './types/calendarWeekView.props'
export {
  getNextWeekDate,
  getPreviousWeekDate,
  getTodayDate,
} from './utils/calendarWeekViewNavigation.util'
