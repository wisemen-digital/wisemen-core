import { Temporal } from 'temporal-polyfill'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'
import type { CalendarSegment } from '@/ui/calendar-week-view/types/calendarSegment.type'

const MINUTES_PER_DAY = 1440

function minutesBetween(from: Temporal.ZonedDateTime, to: Temporal.ZonedDateTime): number {
  return from.until(to).total({
    unit: 'minutes',
  })
}

/**
 * Slices one event into per-day segments across the rendered week, so an
 * event crossing midnight paints on both days instead of being clipped to
 * the column it started in. Days outside `weekDays` are dropped rather than
 * flagged — continuation indicators are Phase 3.
 *
 * ponytail: a DST day is 1380 or 1500 real minutes but is laid out as if it
 * were 1440, so events on a transition day sit up to an hour off. Fix by
 * deriving the day's length from the zoned day bounds when the grid itself
 * learns about variable-length days.
 */
export function splitEventIntoSegments<TMeta = Record<string, unknown>>(
  event: CalendarEvent<TMeta>,
  weekDays: Temporal.PlainDate[],
): CalendarSegment<TMeta>[] {
  const timeZone = event.start.timeZoneId
  const segments: CalendarSegment<TMeta>[] = []

  for (const day of weekDays) {
    const dayStart = day.toZonedDateTime({
      timeZone,
    })
    const dayEnd = dayStart.add({
      days: 1,
    })

    const segmentStart = Temporal.ZonedDateTime.compare(event.start, dayStart) > 0
      ? event.start
      : dayStart
    const segmentEnd = Temporal.ZonedDateTime.compare(event.end, dayEnd) < 0
      ? event.end
      : dayEnd

    const isZeroLength = Temporal.ZonedDateTime.compare(event.start, event.end) === 0
    const startsOnThisDay = Temporal.ZonedDateTime.compare(event.start, dayStart) >= 0
      && Temporal.ZonedDateTime.compare(event.start, dayEnd) < 0

    // A zero-length event overlaps nothing, but still belongs to its own day.
    if (Temporal.ZonedDateTime.compare(segmentStart, segmentEnd) >= 0
      && !(isZeroLength && startsOnThisDay)) {
      continue
    }

    segments.push({
      isEnd: Temporal.ZonedDateTime.compare(segmentEnd, event.end) === 0,
      isStart: Temporal.ZonedDateTime.compare(segmentStart, event.start) === 0,
      day,
      endMin: Math.min(minutesBetween(dayStart, segmentEnd), MINUTES_PER_DAY),
      event,
      startMin: Math.max(minutesBetween(dayStart, segmentStart), 0),
    })
  }

  return segments
}

/**
 * Trims a segment to the grid's visible hours, dropping it when nothing of it
 * falls inside. A segment reaching past a bound loses the matching
 * `isStart`/`isEnd` flag: the edge on screen is the grid's, not the event's,
 * so it must not offer a resize handle that would move a time the user cannot
 * see.
 */
export function clipSegmentToBounds<TMeta = Record<string, unknown>>(
  segment: CalendarSegment<TMeta>,
  boundsStartMin: number,
  boundsEndMin: number,
): CalendarSegment<TMeta> | null {
  const startMin = Math.max(segment.startMin, boundsStartMin)
  const endMin = Math.min(segment.endMin, boundsEndMin)

  const isZeroLength = segment.startMin === segment.endMin
  const isZeroLengthInsideBounds = isZeroLength
    && segment.startMin >= boundsStartMin
    && segment.startMin <= boundsEndMin

  if (startMin > endMin || (startMin === endMin && !isZeroLengthInsideBounds)) {
    return null
  }

  return {
    isEnd: segment.isEnd && segment.endMin <= boundsEndMin,
    isStart: segment.isStart && segment.startMin >= boundsStartMin,
    day: segment.day,
    endMin,
    event: segment.event,
    startMin,
  }
}

/** Every segment of every event, in the order the events were supplied. */
export function splitEventsIntoSegments<TMeta = Record<string, unknown>>(
  events: CalendarEvent<TMeta>[],
  weekDays: Temporal.PlainDate[],
): CalendarSegment<TMeta>[] {
  return events.flatMap((event) => splitEventIntoSegments(event, weekDays))
}
