import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions, ColumnType } from 'typeorm'
import { InclusivityString } from '#src/inclusivity.js'
import { DateTimeRange } from '#src/date-time-range.js'
import { timestamp } from '#src/timestamp.factory.js'

export type DateTimeRangeColumnOptions = Omit<ColumnOptions, 'type' | 'transformer'>

export function DateTimeRangeColumn (options?: DateTimeRangeColumnOptions): PropertyDecorator {
  return applyDecorators(
    Column({
      ...options,
      type: 'tstzrange3' as ColumnType,
      transformer: DateTimeRangeTransformer.getInstance()
    })
  )
}

export class DateTimeRangeTransformer {
  private static instance: DateTimeRangeTransformer | undefined

  public static getInstance (): DateTimeRangeTransformer {
    DateTimeRangeTransformer.instance ??= new DateTimeRangeTransformer()

    return DateTimeRangeTransformer.instance
  }

  private constructor () {}

  from (value: string | null): DateTimeRange | null {
    if (value === null) {
      return null
    }

    // Expected format (2020-01-01T10:00:00,2020-01-02T10:00:00]
    const { 0: leftBracket, [value.length - 1]: rightBracket } = value
    const [startDate, endDate] = value.substring(1, value.length - 1).split(',')

    return new DateTimeRange(
      timestamp(startDate),
      timestamp(endDate),
      leftBracket + rightBracket as InclusivityString
    )
  }

  to (value: DateTimeRange | null): string | null {
    return value?.toString() ?? null
  }
}
