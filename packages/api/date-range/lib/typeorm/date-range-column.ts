import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions } from 'typeorm'
import { wiseDate } from '@wisemen/wise-date'
import { DateRange } from '#src/date-range.js'
import { InclusivityString } from '#src/inclusivity.js'

export type DateRangeColumnOptions = Omit<ColumnOptions, 'type' | 'transformer'>

export function DateRangeColumn (options?: DateRangeColumnOptions): PropertyDecorator {
  return applyDecorators(
    Column({
      ...options,
      type: 'daterange',
      transformer: DateRangeTransformer.getInstance()
    })
  )
}

export class DateRangeTransformer {
  private static instance: DateRangeTransformer | undefined

  public static getInstance (): DateRangeTransformer {
    DateRangeTransformer.instance ??= new DateRangeTransformer()

    return DateRangeTransformer.instance
  }

  private constructor () {}

  from (value: string | null): DateRange | null {
    if (value === null) {
      return null
    }

    // Expected format (2020-01-01,2020-01-02]
    const { 0: leftBracket, [value.length - 1]: rightBracket } = value
    const [startDate, endDate] = value.substring(1, value.length - 1).split(',')

    return new DateRange(
      wiseDate(startDate),
      wiseDate(endDate),
      leftBracket + rightBracket as InclusivityString
    )
  }

  to (value: DateRange | null): string | null {
    return value?.toString() ?? null
  }
}
