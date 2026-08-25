import type { ApiPropertyOptions } from '@nestjs/swagger'
import { ApiProperty } from '@nestjs/swagger'
import type dayjs from 'dayjs'

export const IsoWeekday = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7
}

export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7

export function IsoWeekdayApiProperty (options?: ApiPropertyOptions): PropertyDecorator {
  return ApiProperty({
    ...options,
    enum: IsoWeekday,
    enumName: 'IsoWeekday'
  })
}

export function getNextIsoWeekDate (from: dayjs.Dayjs, targetIsoWeekday: number) {
  const target = from.isoWeekday(targetIsoWeekday)
  const date = from.isoWeekday() >= targetIsoWeekday
    ? target.add(1, 'week')
    : target

  return date.toDate()
}

export function getNextOrSameIsoWeekDate (from: dayjs.Dayjs, targetIsoWeekday: number) {
  const target = from.isoWeekday(targetIsoWeekday)
  const date = from.isoWeekday() > targetIsoWeekday
    ? target.add(1, 'week')
    : target

  return date.toDate()
}

export function getPreviousIsoWeekDate (from: dayjs.Dayjs, targetIsoWeekday: number) {
  const target = from.isoWeekday(targetIsoWeekday)
  const date = from.isoWeekday() <= targetIsoWeekday
    ? target.subtract(1, 'week')
    : target

  return date.toDate()
}

export function getPreviousOrSameIsoWeekDate (from: dayjs.Dayjs, targetIsoWeekday: number) {
  const target = from.isoWeekday(targetIsoWeekday)
  const date = from.isoWeekday() < targetIsoWeekday
    ? target.subtract(1, 'week')
    : target

  return date.toDate()
}
