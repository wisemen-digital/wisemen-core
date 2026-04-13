import { Column, ColumnOptions, ViewColumn } from 'typeorm'
import { ViewColumnOptions } from 'typeorm/decorator/options/ViewColumnOptions.js'
import { plainDate } from '../index.js'
import { PlainDate } from '../plain-date.js'

export type PlainDateColumnOptions = Omit<ColumnOptions, 'type' | 'transformer'>
export type PlainDateViewColumnOptions = Omit<ViewColumnOptions, 'transformer'>

export function PlainDateColumn (options?: PlainDateColumnOptions): PropertyDecorator {
  return Column({
    ...options,
    type: 'date',
    transformer: PlainDateTransformer.getInstance()
  })
}

export function PlainDateViewColumn (options?: PlainDateViewColumnOptions): PropertyDecorator {
  return ViewColumn({
    ...options,
    transformer: PlainDateTransformer.getInstance()
  })
}

export class PlainDateTransformer {
  private static instance: PlainDateTransformer | undefined

  public static getInstance (): PlainDateTransformer {
    PlainDateTransformer.instance ??= new PlainDateTransformer()

    return PlainDateTransformer.instance
  }

  private constructor () {}

  from (value: string | null): PlainDate | null {
    return plainDate(value)
  }

  to (value?: PlainDate | null): string | null | undefined {
    if (value == null) {
      return value
    } else {
      return value.toString()
    }
  }
}
