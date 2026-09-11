import { Temporal } from 'temporal-polyfill'
import {
  describe,
  expect,
  it,
} from 'vitest'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'
import {
  buildAllDayBars,
  lastOccupiedDay,
} from '@/ui/calendar-week-view/utils/calendarAllDayBar.util'

const TIME_ZONE = 'Europe/Brussels'

const WEEK_DAYS = Array.from({
  length: 7,
}, (_, index) => Temporal.PlainDate.from('2026-09-07').add({
  days: index,
}))

function allDayEvent(id: string, startDate: string, endDate: string): CalendarEvent {
  return {
    id,
    allDay: true,
    end: Temporal.ZonedDateTime.from(`${endDate}T00:00[${TIME_ZONE}]`),
    start: Temporal.ZonedDateTime.from(`${startDate}T00:00[${TIME_ZONE}]`),
    meta: {},
  }
}

describe('lastOccupiedDay', () => {
  it('treats the end as exclusive', () => {
    expect(lastOccupiedDay(allDayEvent('a', '2026-09-08', '2026-09-10')).toString())
      .toBe('2026-09-09')
  })

  it('collapses a zero-length range to its start day', () => {
    expect(lastOccupiedDay(allDayEvent('a', '2026-09-08', '2026-09-08')).toString())
      .toBe('2026-09-08')
  })
})

describe('buildAllDayBars', () => {
  it('spans a multi-day event across its columns', () => {
    expect(buildAllDayBars([
      allDayEvent('a', '2026-09-08', '2026-09-11'),
    ], WEEK_DAYS)[0]).toMatchObject({
      isEnd: true,
      isStart: true,
      colSpan: 3,
      colStart: 1,
      lane: 0,
    })
  })

  it('gives a single-day event a span of one', () => {
    expect(buildAllDayBars([
      allDayEvent('a', '2026-09-09', '2026-09-10'),
    ], WEEK_DAYS)[0]).toMatchObject({
      colSpan: 1,
      colStart: 2,
    })
  })

  it('clips a bar reaching past the week and clears the outside edge flags', () => {
    expect(buildAllDayBars([
      allDayEvent('a', '2026-09-05', '2026-09-16'),
    ], WEEK_DAYS)[0]).toMatchObject({
      isEnd: false,
      isStart: false,
      colSpan: 7,
      colStart: 0,
    })
  })

  it('drops an event that falls entirely outside the week', () => {
    expect(buildAllDayBars([
      allDayEvent('a', '2026-10-01', '2026-10-02'),
    ], WEEK_DAYS)).toEqual([])
  })

  it('stacks overlapping bars into separate lanes', () => {
    const bars = buildAllDayBars([
      allDayEvent('a', '2026-09-07', '2026-09-10'),
      allDayEvent('b', '2026-09-08', '2026-09-11'),
    ], WEEK_DAYS)

    expect(bars.map((bar) => bar.lane)).toEqual([
      0,
      1,
    ])
  })

  it('reuses a lane once its previous bar has ended', () => {
    const bars = buildAllDayBars([
      allDayEvent('a', '2026-09-07', '2026-09-09'),
      allDayEvent('b', '2026-09-10', '2026-09-12'),
    ], WEEK_DAYS)

    expect(bars.map((bar) => bar.lane)).toEqual([
      0,
      0,
    ])
  })
})
