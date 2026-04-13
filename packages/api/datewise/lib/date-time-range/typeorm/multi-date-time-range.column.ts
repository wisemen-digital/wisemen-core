import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions, ColumnType, ViewColumn } from 'typeorm'
import { ViewColumnOptions } from 'typeorm/decorator/options/ViewColumnOptions.js'
import { DateTimeRange } from '../date-time-range.js'
import { InclusivityString } from '../../common/inclusivity.js'
import { timestamp } from '../../timestamp/index.js'

export type DateTimeMultiRangeColumnOptions = Omit<ColumnOptions, 'type' | 'transformer'>
export type DateTimeMultiRangeViewColumnOptions = Omit<ViewColumnOptions, 'transformer'>

export function DateTimeMultiRangeColumn (
  options?: DateTimeMultiRangeColumnOptions
): PropertyDecorator {
  return applyDecorators(
    Column({
      ...options,
      type: 'tstzmultirange3' as ColumnType,
      transformer: DateTimeMultiRangeTransformer.getInstance()
    })
  )
}

export function DateTimeMultiRangeViewColumn (
  options?: DateTimeMultiRangeColumnOptions
): PropertyDecorator {
  return applyDecorators(
    ViewColumn({
      ...options,
      transformer: DateTimeMultiRangeTransformer.getInstance()
    })
  )
}

export class DateTimeMultiRangeTransformer {
  private static instance: DateTimeMultiRangeTransformer | undefined

  public static getInstance (): DateTimeMultiRangeTransformer {
    DateTimeMultiRangeTransformer.instance ??= new DateTimeMultiRangeTransformer()

    return DateTimeMultiRangeTransformer.instance
  }

  private constructor () {}

  from (value: string | null): DateTimeRange[] | null {
    if (value === null) {
      return null
    }

    // Expected format {(2020-01-01T10:00:00,2020-01-02T10:00:00], ....}
    // eslint-disable-next-line no-useless-escape
    const regex = /([\[\(][^,\[\]\(\)]+,[^,\[\]\(\)]+[\]\)])/g
    const ranges = value.match(regex)

    if (ranges === null) {
      return []
    }

    const parsedRanges: DateTimeRange[] = []

    for (const range of ranges) {
      const { 0: leftBracket, [range.length - 1]: rightBracket } = range
      const [startDate, endDate] = range.substring(1, range.length - 1).split(',')

      const parsedRange = new DateTimeRange(
        timestamp(startDate),
        timestamp(endDate),
        leftBracket + rightBracket as InclusivityString
      )

      parsedRanges.push(parsedRange)
    }

    return parsedRanges
  }

  to (value: DateTimeRange[] | null | undefined): string | null {
    if (value === null) {
      return null
    }

    const ranges = (value ?? []).map(v => v.toString())

    return '{' + ranges.join(',') + '}'
  }
}
