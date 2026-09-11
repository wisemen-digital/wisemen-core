import type { Temporal } from 'temporal-polyfill'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'
import type {
  CalendarInteractions,
  CalendarProposedUpdate,
  CalendarSlotDraft,
  CalendarUpdateResult,
} from '@/ui/calendar-week-view/types/calendarInteraction.type'

export interface CalendarWeekViewProps<TMeta = Record<string, unknown>> {
  currentDate: Temporal.PlainDate
  /**
   * Live drag gate. Sync, and called only when the snapped target changes, so
   * it is safe to do real work in. Rejecting blocks the drop and marks the
   * drag with `data-drop-invalid`.
   */
  canDropEvent?: (update: CalendarProposedUpdate<TMeta>) => boolean
  /** Live gate for the drag-create rectangle, same contract as `canDropEvent`. */
  canSelectSlot?: (draft: CalendarSlotDraft) => boolean
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
   * Gesture opt-ins. Every gesture is off by default, so adding editing to an
   * existing calendar never silently grants write access.
   *
   * @default { drag: false, resize: false, selectSlot: false }
   */
  interactions?: Partial<CalendarInteractions>
  /**
   * Snap granularity in minutes, applied to move, resize and slot selection
   * alike. Snapping is to the absolute grid, so an off-grid event can be
   * corrected by dragging it.
   *
   * @default 15
   */
  snapDuration?: number
  /**
   * @default 0
   */
  startHour?: number
  /**
   * Called when an event is Alt-dragged. Return the new event — the component
   * cannot invent an id — or `false` to reject the duplicate.
   */
  onEventDuplicate?: (
    update: CalendarProposedUpdate<TMeta>,
  ) => false | CalendarEvent<TMeta> | Promise<false | CalendarEvent<TMeta>>
  /**
   * Called once a move, resize or duplicate lands. Returning `false` reverts
   * the optimistic position; returning an object accepts it with an
   * adjustment; returning `true`/nothing accepts it as proposed. May return a
   * promise — the optimistic position holds until it settles.
   */
  onEventUpdate?: (
    update: CalendarProposedUpdate<TMeta>,
  ) => CalendarUpdateResult | Promise<CalendarUpdateResult>
}
