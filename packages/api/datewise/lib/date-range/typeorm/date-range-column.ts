import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions, ViewColumn } from 'typeorm'
import { DateRange } from '../date-range.js'
import { plainDate } from '../../plain-date/index.js'
import { InclusivityString } from '../../common/inclusivity.js'
import { FiniteDateRangeCheck } from './finite-date-range.check.decorator.js'

export type DateRangeColumnOptions = Omit<ColumnOptions, 'type' | 'transformer'> & {
  /**
   * If set to true, a CHECK constraint is added to only allow finite date ranges.
   * Default false.
   */
  finiteOnly?: boolean
}
export type DateRangeViewColumnOptions = Omit<ColumnOptions, 'transformer'>

export function DateRangeColumn (options?: DateRangeColumnOptions): PropertyDecorator {
  const decorators: PropertyDecorator[] = [
    Column({
      ...options,
      type: 'daterange',
      transformer: DateRangeTransformer.getInstance()
    })
  ]

  if (options?.finiteOnly === true) {
    decorators.push(FiniteDateRangeCheck())
  }

  return applyDecorators(...decorators)
}

export function DateRangeViewColumn (options?: DateRangeViewColumnOptions): PropertyDecorator {
  return applyDecorators(
    ViewColumn({
      ...options,
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
      plainDate(startDate),
      plainDate(endDate),
      leftBracket + rightBracket as InclusivityString
    )
  }

  to (value: DateRange | null): string | null {
    return value?.toString() ?? null
  }
}
