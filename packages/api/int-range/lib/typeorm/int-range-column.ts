import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions, ColumnType } from 'typeorm'
import { InclusivityString } from '#src/inclusivity.js'
import { IntRange } from '#src/int-range.js'

export type IntRangeColumnOptions = Omit<ColumnOptions, 'type' | 'transformer'>

export function IntRangeColumn (options?: IntRangeColumnOptions): PropertyDecorator {
  return applyDecorators(
    Column({
      ...options,
      type: 'int8range' as ColumnType,
      transformer: IntRangeTransformer.getInstance()
    })
  )
}

export class IntRangeTransformer {
  private static instance: IntRangeTransformer | undefined

  public static getInstance (): IntRangeTransformer {
    IntRangeTransformer.instance ??= new IntRangeTransformer()

    return IntRangeTransformer.instance
  }

  private constructor () {}

  from (value: string | null): IntRange | null {
    if (value === null) {
      return null
    }

    // Expected format [1,10)
    const { 0: leftBracket, [value.length - 1]: rightBracket } = value
    const [start, end] = value.substring(1, value.length - 1).split(',').map(Number)

    return new IntRange(
      start,
      end,
      leftBracket + rightBracket as InclusivityString
    )
  }

  to (value: IntRange | null): string | null {
    return value?.toString() ?? null
  }
}
