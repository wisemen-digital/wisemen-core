import { Temporal } from 'temporal-polyfill'
import type { Ref } from 'vue'
import {
  onBeforeUnmount,
  shallowRef,
} from 'vue'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'
import type {
  CalendarProposedUpdate,
  CalendarSlotDraft,
  CalendarUpdateSource,
} from '@/ui/calendar-week-view/types/calendarInteraction.type'
import {
  clampToBounds,
  pointerToColumnIndex,
  pointerToMinutes,
  snapMinutes,
} from '@/ui/calendar-week-view/utils/calendarDragMath.util'

/**
 * Activation thresholds mirrored from ReUI's event calendar, which in turn
 * took them from dnd-kit. Movement past the touch tolerance before the delay
 * elapses cancels the gesture, so a tap stays a tap.
 */
const ACTIVATION = {
  autoScrollEdgePx: 48,
  autoScrollMaxStepPx: 15,
  createDistancePx: 4,
  moveDistancePx: 5,
  touchDelayMs: 250,
  touchTolerancePx: 5,
} as const

export type CalendarGestureKind = 'create' | 'move' | 'resize-end' | 'resize-start'

export interface CalendarDragState<TMeta = Record<string, unknown>> {
  isDuplicate: boolean
  isValid: boolean
  end: Temporal.ZonedDateTime
  event: CalendarEvent<TMeta>
  kind: Exclude<CalendarGestureKind, 'create'>
  start: Temporal.ZonedDateTime
}

export interface CalendarCarryState {
  height: number
  width: number
  x: number
  y: number
}

interface PendingGesture<TMeta> {
  touchTimeoutId: ReturnType<typeof setTimeout> | undefined
  isActivated: boolean
  /** All-day bars move and resize by whole days; the pointer's Y is ignored. */
  isDayGranular: boolean
  anchorDayIndex: number
  anchorMinutes: number
  day: Temporal.PlainDate
  event: CalendarEvent<TMeta> | null
  grabOffsetMinutes: number
  kind: CalendarGestureKind
  originX: number
  originY: number
  pointerType: string
  targetRect: DOMRect | null
}

function minZonedDateTime(
  a: Temporal.ZonedDateTime,
  b: Temporal.ZonedDateTime,
): Temporal.ZonedDateTime {
  return Temporal.ZonedDateTime.compare(a, b) <= 0 ? a : b
}

function maxZonedDateTime(
  a: Temporal.ZonedDateTime,
  b: Temporal.ZonedDateTime,
): Temporal.ZonedDateTime {
  return Temporal.ZonedDateTime.compare(a, b) >= 0 ? a : b
}

function toUpdateSource(state: {
  isDuplicate: boolean
  kind: Exclude<CalendarGestureKind, 'create'>
}): CalendarUpdateSource {
  if (state.isDuplicate) {
    return 'duplicate'
  }

  return state.kind === 'move' ? 'drag' : state.kind
}

function distanceBetween(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by)
}

export function useCalendarDrag<TMeta = Record<string, unknown>>(options: {
  canDropEvent: Ref<((update: CalendarProposedUpdate<TMeta>) => boolean) | undefined>
  canSelectSlot: Ref<((draft: CalendarSlotDraft) => boolean) | undefined>
  endHour: Ref<number>
  gridElement: Ref<HTMLElement | null>
  scrollElement: Ref<HTMLElement | null>
  snapDuration: Ref<number>
  startHour: Ref<number>
  weekDays: Ref<Temporal.PlainDate[]>
  onCommitSlot: (draft: CalendarSlotDraft) => void
  onCommitUpdate: (update: CalendarProposedUpdate<TMeta>) => void
}): {
  carryState: Ref<CalendarCarryState | null>
  dragState: Ref<CalendarDragState<TMeta> | null>
  slotDraft: Ref<CalendarSlotDraft | null>
  startEventGesture: (
    nativeEvent: PointerEvent,
    event: CalendarEvent<TMeta>,
    kind: Exclude<CalendarGestureKind, 'create'>,
    isDayGranular?: boolean,
  ) => void
  startSlotGesture: (nativeEvent: PointerEvent, day: Temporal.PlainDate) => void
} {
  const dragState = shallowRef<CalendarDragState<TMeta> | null>(null)
  const slotDraft = shallowRef<CalendarSlotDraft | null>(null)
  const carryState = shallowRef<CalendarCarryState | null>(null)

  let pending: PendingGesture<TMeta> | null = null
  let gridRect: DOMRect | null = null
  let lastValidationKey = ''
  let lastValidationResult = true
  let autoScrollFrameId: number | undefined
  let autoScrollDelta = 0
  let startScrollTop = 0

  function boundsStartMin(): number {
    return options.startHour.value * 60
  }

  function boundsEndMin(): number {
    return options.endHour.value * 60
  }

  function timeZoneOf(event: CalendarEvent<TMeta> | null): string {
    return event?.start.timeZoneId ?? new Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  function toZonedDateTime(
    day: Temporal.PlainDate,
    minutes: number,
    timeZone: string,
  ): Temporal.ZonedDateTime {
    return day.toZonedDateTime({
      timeZone,
    }).add({
      minutes,
    })
  }

  /** Pointer position resolved against the grid box measured at gesture start. */
  function resolvePointer(nativeEvent: PointerEvent): {
    day: Temporal.PlainDate
    minutes: number
  } | null {
    if (gridRect === null || options.weekDays.value.length === 0) {
      return null
    }

    const columnIndex = pointerToColumnIndex({
      clientX: nativeEvent.clientX,
      columnCount: options.weekDays.value.length,
      rect: gridRect,
    })

    const day = options.weekDays.value[columnIndex]

    if (day === undefined) {
      return null
    }

    return {
      day,
      // The grid box is measured once, but auto-scroll slides the content
      // under it, so the pointer must be corrected by the scroll travelled.
      minutes: pointerToMinutes({
        clientY: nativeEvent.clientY
          + ((options.scrollElement.value?.scrollTop ?? 0) - startScrollTop),
        endHour: options.endHour.value,
        rect: gridRect,
        startHour: options.startHour.value,
      }),
    }
  }

  function resolveDayIndex(nativeEvent: PointerEvent): number | null {
    if (gridRect === null || options.weekDays.value.length === 0) {
      return null
    }

    return pointerToColumnIndex({
      clientX: nativeEvent.clientX,
      columnCount: options.weekDays.value.length,
      rect: gridRect,
    })
  }

  /**
   * Day-granular move and resize, mirroring ReUI's bar-edge behaviour: a move
   * shifts whole days and keeps the duration, a start-resize lands on the
   * target day, and an end-resize sets the exclusive end to the day after the
   * target. A resize that would invert the range is dropped, not clamped —
   * there is no sub-day room to clamp into.
   */
  function updateDayGranularGesture(
    nativeEvent: PointerEvent,
    gesture: PendingGesture<TMeta>,
  ): void {
    const dayIndex = resolveDayIndex(nativeEvent)
    const event = gesture.event

    if (dayIndex === null || event === null || gesture.kind === 'create') {
      return
    }

    const kind = gesture.kind

    const targetDay = options.weekDays.value[dayIndex]

    if (targetDay === undefined) {
      return
    }

    const timeZone = timeZoneOf(event)
    const targetDayStart = targetDay.toZonedDateTime({
      timeZone,
    })

    let start = event.start
    let end = event.end

    if (kind === 'move') {
      const deltaDays = dayIndex - gesture.anchorDayIndex

      start = event.start.add({
        days: deltaDays,
      })
      end = event.end.add({
        days: deltaDays,
      })
    }
    else if (kind === 'resize-start') {
      start = targetDayStart

      if (Temporal.ZonedDateTime.compare(start, event.end) >= 0) {
        return
      }
    }
    else {
      end = targetDayStart.add({
        days: 1,
      })

      if (Temporal.ZonedDateTime.compare(end, event.start) <= 0) {
        return
      }
    }

    const isDuplicate = kind === 'move' && nativeEvent.altKey

    dragState.value = {
      isDuplicate,
      isValid: validate({
        end,
        event,
        source: toUpdateSource({
          isDuplicate,
          kind,
        }),
        start,
      }),
      end,
      event,
      kind,
      start,
    }
  }

  function validate(update: CalendarProposedUpdate<TMeta>): boolean {
    const key = `${update.start.toString()}|${update.end.toString()}|${update.source}`

    // Sync predicate, re-run only when the snapped target actually moves.
    if (key === lastValidationKey) {
      return lastValidationResult
    }

    lastValidationKey = key
    lastValidationResult = options.canDropEvent.value?.(update) ?? true

    return lastValidationResult
  }

  function updateMoveGesture(nativeEvent: PointerEvent, gesture: PendingGesture<TMeta>): void {
    const pointer = resolvePointer(nativeEvent)
    const event = gesture.event

    if (pointer === null || event === null) {
      return
    }

    const timeZone = timeZoneOf(event)
    const durationMinutes = event.start.until(event.end).total({
      unit: 'minutes',
    })
    const gridMinutes = boundsEndMin() - boundsStartMin()

    const rawStartMinutes = snapMinutes(
      pointer.minutes - gesture.grabOffsetMinutes,
      options.snapDuration.value,
    )

    // A block longer than the grid has no "inside" to be clamped into;
    // clamping it would yank a multi-day event to the top of the column.
    const clamped = durationMinutes >= gridMinutes
      ? {
          endMin: rawStartMinutes + durationMinutes,
          startMin: rawStartMinutes,
        }
      : clampToBounds({
          boundsEndMin: boundsEndMin(),
          boundsStartMin: boundsStartMin(),
          endMin: rawStartMinutes + durationMinutes,
          startMin: rawStartMinutes,
        })

    const start = toZonedDateTime(pointer.day, clamped.startMin, timeZone)
    const end = start.add({
      minutes: durationMinutes,
    })

    const isDuplicate = nativeEvent.altKey

    dragState.value = {
      isDuplicate,
      isValid: validate({
        end,
        event,
        source: isDuplicate ? 'duplicate' : 'drag',
        start,
      }),
      end,
      event,
      kind: 'move',
      start,
    }
  }

  function updateResizeGesture(nativeEvent: PointerEvent, gesture: PendingGesture<TMeta>): void {
    const pointer = resolvePointer(nativeEvent)
    const event = gesture.event

    if (pointer === null || event === null) {
      return
    }

    const timeZone = timeZoneOf(event)
    const snap = options.snapDuration.value
    const pointerMinutes = snapMinutes(pointer.minutes, snap)
    const isResizingStart = gesture.kind === 'resize-start'

    const clampedMinutes = Math.min(
      Math.max(pointerMinutes, boundsStartMin()),
      boundsEndMin(),
    )
    const candidate = toZonedDateTime(pointer.day, clampedMinutes, timeZone)

    // Clamp in absolute instants rather than minute-of-day: an event crossing
    // midnight has an end whose minute-of-day is *below* its start's.
    const start = isResizingStart
      ? minZonedDateTime(candidate, event.end.subtract({
          minutes: snap,
        }))
      : event.start
    const end = isResizingStart
      ? event.end
      : maxZonedDateTime(candidate, event.start.add({
          minutes: snap,
        }))

    dragState.value = {
      isDuplicate: false,
      isValid: validate({
        end,
        event,
        source: isResizingStart ? 'resize-start' : 'resize-end',
        start,
      }),
      end,
      event,
      kind: isResizingStart ? 'resize-start' : 'resize-end',
      start,
    }
  }

  function updateCreateGesture(nativeEvent: PointerEvent, gesture: PendingGesture<TMeta>): void {
    const pointer = resolvePointer(nativeEvent)

    if (pointer === null) {
      return
    }

    const timeZone = timeZoneOf(null)
    const snap = options.snapDuration.value
    const currentMinutes = snapMinutes(pointer.minutes, snap)

    const startMin = Math.max(
      Math.min(gesture.anchorMinutes, currentMinutes),
      boundsStartMin(),
    )
    const endMin = Math.min(
      Math.max(gesture.anchorMinutes, currentMinutes, startMin + snap),
      boundsEndMin(),
    )

    const draft: CalendarSlotDraft = {
      day: gesture.day,
      end: toZonedDateTime(gesture.day, endMin, timeZone),
      start: toZonedDateTime(gesture.day, startMin, timeZone),
    }

    slotDraft.value = options.canSelectSlot.value?.(draft) === false
      ? null
      : draft
  }

  function updateCarry(nativeEvent: PointerEvent, gesture: PendingGesture<TMeta>): void {
    if (gesture.kind !== 'move' || gesture.targetRect === null) {
      return
    }

    carryState.value = {
      height: gesture.targetRect.height,
      width: gesture.targetRect.width,
      x: nativeEvent.clientX - (gesture.originX - gesture.targetRect.left),
      y: nativeEvent.clientY - (gesture.originY - gesture.targetRect.top),
    }
  }

  function stopAutoScroll(): void {
    if (autoScrollFrameId !== undefined) {
      cancelAnimationFrame(autoScrollFrameId)
      autoScrollFrameId = undefined
    }

    autoScrollDelta = 0
  }

  function runAutoScroll(): void {
    const scrollElement = options.scrollElement.value

    if (scrollElement === null || autoScrollDelta === 0) {
      stopAutoScroll()

      return
    }

    const before = scrollElement.scrollTop

    scrollElement.scrollTop += autoScrollDelta

    // Parked against a scroll limit: nothing is moving, so stop burning frames.
    if (scrollElement.scrollTop === before) {
      stopAutoScroll()

      return
    }

    autoScrollFrameId = requestAnimationFrame(runAutoScroll)
  }

  function updateAutoScroll(nativeEvent: PointerEvent): void {
    const scrollElement = options.scrollElement.value

    if (scrollElement === null) {
      return
    }

    const rect = scrollElement.getBoundingClientRect()
    const edge = ACTIVATION.autoScrollEdgePx
    const step = ACTIVATION.autoScrollMaxStepPx

    let delta = 0

    if (nativeEvent.clientY < rect.top + edge) {
      delta = -step * Math.min(1, (rect.top + edge - nativeEvent.clientY) / edge)
    }
    else if (nativeEvent.clientY > rect.bottom - edge) {
      delta = step * Math.min(1, (nativeEvent.clientY - (rect.bottom - edge)) / edge)
    }

    autoScrollDelta = delta

    if (delta !== 0 && autoScrollFrameId === undefined) {
      autoScrollFrameId = requestAnimationFrame(runAutoScroll)
    }
  }

  function activate(gesture: PendingGesture<TMeta>): void {
    gesture.isActivated = true
    gridRect = options.gridElement.value?.getBoundingClientRect() ?? null
    startScrollTop = options.scrollElement.value?.scrollTop ?? 0
    document.body.style.userSelect = 'none'
  }

  function applyGesture(nativeEvent: PointerEvent, gesture: PendingGesture<TMeta>): void {
    if (gesture.kind === 'create') {
      updateCreateGesture(nativeEvent, gesture)
    }
    else if (gesture.isDayGranular) {
      updateDayGranularGesture(nativeEvent, gesture)
      updateCarry(nativeEvent, gesture)
    }
    else if (gesture.kind === 'move') {
      updateMoveGesture(nativeEvent, gesture)
      updateCarry(nativeEvent, gesture)
    }
    else {
      updateResizeGesture(nativeEvent, gesture)
    }

    updateAutoScroll(nativeEvent)
  }

  function onPointerMove(nativeEvent: PointerEvent): void {
    const gesture = pending

    if (gesture === null) {
      return
    }

    const travelled = distanceBetween(
      nativeEvent.clientX,
      nativeEvent.clientY,
      gesture.originX,
      gesture.originY,
    )

    if (!gesture.isActivated) {
      if (gesture.pointerType === 'touch') {
        // Moving before the long-press elapses means the user is scrolling.
        if (travelled > ACTIVATION.touchTolerancePx) {
          cancelGesture()
        }

        return
      }

      const threshold = gesture.kind === 'create'
        ? ACTIVATION.createDistancePx
        : ACTIVATION.moveDistancePx

      if (travelled < threshold) {
        return
      }

      activate(gesture)
    }

    nativeEvent.preventDefault()
    applyGesture(nativeEvent, gesture)
  }

  function commitGesture(): void {
    const gesture = pending
    const state = dragState.value
    const draft = slotDraft.value

    if (gesture === null) {
      return
    }

    if (gesture.kind === 'create' && draft !== null) {
      options.onCommitSlot(draft)
    }
    else if (state !== null && state.isValid) {
      options.onCommitUpdate({
        end: state.end,
        event: state.event,
        source: toUpdateSource(state),
        start: state.start,
      })
    }

    teardown()
  }

  function cancelGesture(): void {
    teardown()
  }

  function teardown(): void {
    if (pending?.touchTimeoutId !== undefined) {
      clearTimeout(pending.touchTimeoutId)
    }

    pending = null
    gridRect = null
    lastValidationKey = ''
    dragState.value = null
    slotDraft.value = null
    carryState.value = null
    document.body.style.userSelect = ''
    stopAutoScroll()

    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', commitGesture)
    window.removeEventListener('pointercancel', cancelGesture)
    window.removeEventListener('keydown', onKeyDown)
  }

  function onKeyDown(nativeEvent: KeyboardEvent): void {
    if (nativeEvent.key === 'Escape') {
      cancelGesture()
    }
  }

  function beginGesture(gesture: PendingGesture<TMeta>): void {
    teardown()
    pending = gesture

    // Window listeners rather than setPointerCapture: the grid re-renders
    // mid-drag, and capture dies with the element it was set on.
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', commitGesture)
    window.addEventListener('pointercancel', cancelGesture)
    window.addEventListener('keydown', onKeyDown)

    if (gesture.pointerType === 'touch') {
      gesture.touchTimeoutId = setTimeout(() => {
        if (pending === gesture) {
          activate(gesture)
        }
      }, ACTIVATION.touchDelayMs)
    }
  }

  function startEventGesture(
    nativeEvent: PointerEvent,
    event: CalendarEvent<TMeta>,
    kind: Exclude<CalendarGestureKind, 'create'>,
    isDayGranular = false,
  ): void {
    const targetRect = (nativeEvent.currentTarget as HTMLElement | null)
      ?.getBoundingClientRect() ?? null

    const measuredGrid = options.gridElement.value?.getBoundingClientRect() ?? null

    const grabbedMinutes = measuredGrid === null
      ? 0
      : pointerToMinutes({
          clientY: nativeEvent.clientY,
          endHour: options.endHour.value,
          rect: measuredGrid,
          startHour: options.startHour.value,
        })

    const eventStartMinutes = event.start.hour * 60 + event.start.minute

    beginGesture({
      touchTimeoutId: undefined,
      isActivated: false,
      isDayGranular,
      anchorDayIndex: measuredGrid === null
        ? 0
        : pointerToColumnIndex({
            clientX: nativeEvent.clientX,
            columnCount: options.weekDays.value.length,
            rect: measuredGrid,
          }),
      anchorMinutes: grabbedMinutes,
      day: event.start.toPlainDate(),
      event,
      grabOffsetMinutes: kind === 'move' ? grabbedMinutes - eventStartMinutes : 0,
      kind,
      originX: nativeEvent.clientX,
      originY: nativeEvent.clientY,
      pointerType: nativeEvent.pointerType,
      targetRect,
    })
  }

  function startSlotGesture(nativeEvent: PointerEvent, day: Temporal.PlainDate): void {
    const measuredGrid = options.gridElement.value?.getBoundingClientRect() ?? null

    const anchorMinutes = measuredGrid === null
      ? boundsStartMin()
      : snapMinutes(
          pointerToMinutes({
            clientY: nativeEvent.clientY,
            endHour: options.endHour.value,
            rect: measuredGrid,
            startHour: options.startHour.value,
          }),
          options.snapDuration.value,
        )

    beginGesture({
      touchTimeoutId: undefined,
      isActivated: false,
      isDayGranular: false,
      anchorDayIndex: 0,
      anchorMinutes,
      day,
      event: null,
      grabOffsetMinutes: 0,
      kind: 'create',
      originX: nativeEvent.clientX,
      originY: nativeEvent.clientY,
      pointerType: nativeEvent.pointerType,
      targetRect: null,
    })
  }

  onBeforeUnmount(() => {
    teardown()
  })

  return {
    carryState,
    dragState,
    slotDraft,
    startEventGesture,
    startSlotGesture,
  }
}
