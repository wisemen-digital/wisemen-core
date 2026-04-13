import { applyDecorators } from '@nestjs/common'
import { Column, ColumnOptions, ViewColumn } from 'typeorm'
import { PlainTimeImpl } from '../plain-time.js'

export type PlainTimeColumnOptions = Omit<ColumnOptions, 'type' | 'transformer'>
export type PlainTimeViewColumnOptions = Omit<ColumnOptions, 'transformer'>

export function PlainTimeColumn (options?: PlainTimeColumnOptions): PropertyDecorator {
  return applyDecorators(
    Column({ ...options, type: 'time', transformer: PlainTimeTransformer.getInstance() })
  )
}

export function PlainTimeViewColumn (options?: PlainTimeViewColumnOptions): PropertyDecorator {
  return applyDecorators(
    ViewColumn({ ...options, transformer: PlainTimeTransformer.getInstance() })
  )
}

export class PlainTimeTransformer {
  private static instance: PlainTimeTransformer | undefined

  public static getInstance (): PlainTimeTransformer {
    PlainTimeTransformer.instance ??= new PlainTimeTransformer()

    return PlainTimeTransformer.instance
  }

  private constructor () {}

  from (value: string | null): PlainTimeImpl | null {
    if (typeof value === 'string') {
      return new PlainTimeImpl(value)
    } else {
      return null
    }
  }

  to (value?: PlainTimeImpl | null): string | null | undefined {
    if (value == null) {
      return value
    } else {
      return value.toString()
    }
  }
}
