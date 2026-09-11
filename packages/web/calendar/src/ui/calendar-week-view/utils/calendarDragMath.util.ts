import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'
import type { CalendarInteractions } from '@/ui/calendar-week-view/types/calendarInteraction.type'

/**
 * Minutes from midnight for a pointer position inside a time grid whose box
 * is `rect`. The rect is measured once per gesture: the scroll container
 * moves its own `scrollTop` during auto-scroll rather than moving the grid's
 * box, so a single measurement stays correct for the whole drag.
 */
export function pointerToMinutes(options: {
  clientY: number
  endHour: number
  rect: { height: number
    top: number }
  startHour: number
}): number {
  const gridMinutes = (options.endHour - options.startHour) * 60

  if (options.rect.height <= 0) {
    return options.startHour * 60
  }

  const fraction = (options.clientY - options.rect.top) / options.rect.height

  return options.startHour * 60 + fraction * gridMinutes
}

/**
 * Index of the day column under a pointer, clamped to the grid. Columns are
 * equal-width (`grid-cols-7`), so one rect beats measuring each column.
 */
export function pointerToColumnIndex(options: {
  clientX: number
  columnCount: number
  rect: { left: number
    width: number }
}): number {
  if (options.rect.width <= 0 || options.columnCount <= 0) {
    return 0
  }

  const columnWidth = options.rect.width / options.columnCount
  const index = Math.floor((options.clientX - options.rect.left) / columnWidth)

  return Math.min(Math.max(index, 0), options.columnCount - 1)
}

/** Snaps to the absolute grid, not to the drag delta, so an off-grid event is correctable by dragging it. */
export function snapMinutes(minutes: number, snapDuration: number): number {
  if (snapDuration <= 0) {
    return minutes
  }

  return Math.round(minutes / snapDuration) * snapDuration
}

/**
 * Slides the whole block inside the grid, preserving its duration. An event
 * left hanging past `endHour` would be unreachable for a later drag, so a
 * move never produces one. A block longer than the grid pins to the top.
 */
export function clampToBounds(options: {
  boundsEndMin: number
  boundsStartMin: number
  endMin: number
  startMin: number
}): {
  endMin: number
  startMin: number
} {
  const duration = options.endMin - options.startMin
  const boundsDuration = options.boundsEndMin - options.boundsStartMin

  if (duration >= boundsDuration) {
    return {
      endMin: options.boundsStartMin + duration,
      startMin: options.boundsStartMin,
    }
  }

  const startMin = Math.min(
    Math.max(options.startMin, options.boundsStartMin),
    options.boundsEndMin - duration,
  )

  return {
    endMin: startMin + duration,
    startMin,
  }
}

/**
 * `readOnly` wins unconditionally. Otherwise a per-event flag overrides the
 * global in both directions, so `interactions.drag: false` plus
 * `draggable: true` makes that one event draggable — narrowing only would
 * make the per-event flags dead whenever the global is off.
 */
export function resolveEditability(
  event: Pick<CalendarEvent, 'draggable' | 'readOnly' | 'resizable'>,
  interactions: CalendarInteractions,
): {
  isDraggable: boolean
  isResizable: boolean
} {
  if (event.readOnly === true) {
    return {
      isDraggable: false,
      isResizable: false,
    }
  }

  return {
    isDraggable: event.draggable ?? interactions.drag,
    isResizable: event.resizable ?? interactions.resize,
  }
}
