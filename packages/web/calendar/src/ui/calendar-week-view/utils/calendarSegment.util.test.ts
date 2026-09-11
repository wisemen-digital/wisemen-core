import { Temporal } from 'temporal-polyfill'
import {
  describe,
  expect,
  it,
} from 'vitest'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'
import type { CalendarSegment } from '@/ui/calendar-week-view/types/calendarSegment.type'
import {
  clipSegmentToBounds,
  splitEventIntoSegments,
} from '@/ui/calendar-week-view/utils/calendarSegment.util'

const TIME_ZONE = 'Europe/Brussels'

const WEEK_DAYS = Array.from({
  length: 7,
}, (_, index) => Temporal.PlainDate.from('2026-09-07').add({
  days: index,
}))

function buildEvent(start: string, end: string): CalendarEvent {
  return {
    id: 'event-1',
    end: Temporal.ZonedDateTime.from(`${end}[${TIME_ZONE}]`),
    start: Temporal.ZonedDateTime.from(`${start}[${TIME_ZONE}]`),
    meta: {},
  }
}

describe('splitEventIntoSegments', () => {
  it('yields one whole segment for a single-day event', () => {
    const segments = splitEventIntoSegments(
      buildEvent('2026-09-08T09:00', '2026-09-08T10:30'),
      WEEK_DAYS,
    )

    expect(segments).toHaveLength(1)
    expect(segments[0]?.day.toString()).toBe('2026-09-08')
    expect(segments[0]?.startMin).toBe(540)
    expect(segments[0]?.endMin).toBe(630)
    expect(segments[0]?.isStart).toBeTruthy()
    expect(segments[0]?.isEnd).toBeTruthy()
  })

  it('splits an event crossing midnight into two segments', () => {
    const segments = splitEventIntoSegments(
      buildEvent('2026-09-08T23:00', '2026-09-09T01:00'),
      WEEK_DAYS,
    )

    expect(segments).toHaveLength(2)

    expect(segments[0]).toMatchObject({
      isEnd: false,
      isStart: true,
      endMin: 1440,
      startMin: 1380,
    })
    expect(segments[1]).toMatchObject({
      isEnd: true,
      isStart: false,
      endMin: 60,
      startMin: 0,
    })
  })

  it('marks the middle day of a multi-day event as neither start nor end', () => {
    const segments = splitEventIntoSegments(
      buildEvent('2026-09-08T10:00', '2026-09-10T14:00'),
      WEEK_DAYS,
    )

    expect(segments).toHaveLength(3)
    expect(segments[1]).toMatchObject({
      isEnd: false,
      isStart: false,
      endMin: 1440,
      startMin: 0,
    })
  })

  it('caps segments at the rendered week', () => {
    const segments = splitEventIntoSegments(
      buildEvent('2026-09-12T10:00', '2026-09-20T14:00'),
      WEEK_DAYS,
    )

    expect(segments.map((segment) => segment.day.toString())).toEqual([
      '2026-09-12',
      '2026-09-13',
    ])
  })

  it('drops an event that falls entirely outside the week', () => {
    expect(splitEventIntoSegments(
      buildEvent('2026-10-01T10:00', '2026-10-01T11:00'),
      WEEK_DAYS,
    )).toEqual([])
  })

  it('keeps a zero-length event on its own day', () => {
    const segments = splitEventIntoSegments(
      buildEvent('2026-09-08T09:00', '2026-09-08T09:00'),
      WEEK_DAYS,
    )

    expect(segments).toHaveLength(1)
    expect(segments[0]).toMatchObject({
      endMin: 540,
      startMin: 540,
    })
  })

  it('does not leak an event ending exactly at midnight into the next day', () => {
    const segments = splitEventIntoSegments(
      buildEvent('2026-09-08T22:00', '2026-09-09T00:00'),
      WEEK_DAYS,
    )

    expect(segments).toHaveLength(1)
    expect(segments[0]?.day.toString()).toBe('2026-09-08')
    expect(segments[0]?.isEnd).toBeTruthy()
  })
})

function segmentOf(startMin: number, endMin: number): CalendarSegment {
  return {
    isEnd: true,
    isStart: true,
    day: WEEK_DAYS[0]!,
    endMin,
    event: buildEvent('2026-09-07T00:00', '2026-09-07T01:00'),
    startMin,
  }
}

describe('clipSegmentToBounds', () => {
  it('leaves a segment already inside the bounds alone', () => {
    expect(clipSegmentToBounds(segmentOf(540, 600), 360, 1080)).toMatchObject({
      isEnd: true,
      isStart: true,
      endMin: 600,
      startMin: 540,
    })
  })

  it('trims an after-midnight segment to the grid start and drops its start flag', () => {
    expect(clipSegmentToBounds(segmentOf(0, 150), 360, 1080)).toBeNull()
  })

  it('trims a segment straddling the grid start', () => {
    expect(clipSegmentToBounds(segmentOf(300, 600), 360, 1080)).toMatchObject({
      isEnd: true,
      isStart: false,
      endMin: 600,
      startMin: 360,
    })
  })

  it('trims a segment straddling the grid end', () => {
    expect(clipSegmentToBounds(segmentOf(1020, 1200), 360, 1080)).toMatchObject({
      isEnd: false,
      isStart: true,
      endMin: 1080,
      startMin: 1020,
    })
  })

  it('drops a segment entirely past the grid end', () => {
    expect(clipSegmentToBounds(segmentOf(1200, 1320), 360, 1080)).toBeNull()
  })

  it('keeps a zero-length segment that sits inside the bounds', () => {
    expect(clipSegmentToBounds(segmentOf(540, 540), 360, 1080)).toMatchObject({
      endMin: 540,
      startMin: 540,
    })
  })
})
