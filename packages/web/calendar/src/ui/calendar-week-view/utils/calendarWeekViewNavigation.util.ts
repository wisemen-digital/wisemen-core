import { Temporal } from 'temporal-polyfill'

export function getNextWeekDate(currentDate: Temporal.PlainDate): Temporal.PlainDate {
  return currentDate.add({
    weeks: 1,
  })
}

export function getPreviousWeekDate(currentDate: Temporal.PlainDate): Temporal.PlainDate {
  return currentDate.subtract({
    weeks: 1,
  })
}

export function getTodayDate(): Temporal.PlainDate {
  return Temporal.Now.plainDateISO()
}
