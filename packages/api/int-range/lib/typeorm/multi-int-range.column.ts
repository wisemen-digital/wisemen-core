import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions, ColumnType } from 'typeorm'
import { InclusivityString } from '#src/inclusivity.js'
import { IntRange } from '#src/int-range.js'

export type IntMultiRangeColumnOptions = Omit<ColumnOptions, 'type' | 'transformer'>

export function IntMultiRangeColumn (
  options?: IntMultiRangeColumnOptions
): PropertyDecorator {
  return applyDecorators(
    Column({
      ...options,
      type: 'int8multirange' as ColumnType,
      transformer: IntMultiRangeTransformer.getInstance()
    })
  )
}

class IntMultiRangeTransformer {
  private static instance: IntMultiRangeTransformer | undefined

  public static getInstance (): IntMultiRangeTransformer {
    IntMultiRangeTransformer.instance ??= new IntMultiRangeTransformer()

    return IntMultiRangeTransformer.instance
  }

  private constructor () {}

  from (value: string | null): IntRange[] | null {
    if (value === null) {
      return null
    }

    // Expected format {[1,10), [20,30)}
    // eslint-disable-next-line no-useless-escape
    const regex = /([\[\(][^,\[\]\(\)]+,[^,\[\]\(\)]+[\]\)])/g
    const ranges = value.match(regex)

    if (ranges === null) {
      return []
    }

    const parsedRanges: IntRange[] = []

    for (const range of ranges) {
      const { 0: leftBracket, [range.length - 1]: rightBracket } = range
      const [start, end] = range.substring(1, range.length - 1).split(',').map(Number)

      const parsedRange = new IntRange(
        start,
        end,
        leftBracket + rightBracket as InclusivityString
      )

      parsedRanges.push(parsedRange)
    }

    return parsedRanges
  }

  to (value: IntRange[] | null | undefined): string | null {
    if (value === null) {
      return null
    }

    const ranges = (value ?? []).map(v => v.toString())

    return '{' + ranges.join(',') + '}'
  }
}
