import { Column, ColumnOptions } from 'typeorm'
import { Timestamp } from '../timestamp.js'
import { timestamp } from '../index.js'

export type TimestampColumnOptions = Omit<ColumnOptions, 'type' | 'transformer' | 'precision'>

export function TimestampColumn (options?: TimestampColumnOptions): PropertyDecorator {
  return Column({
    ...options,
    type: 'timestamptz',
    precision: 3,
    transformer: TRANSFORMER
  })
}

class TimestampTransformer {
  from (value: string | null): Timestamp | null {
    return timestamp(value)
  }

  to (value?: Timestamp | null): string | null | undefined {
    if (value == null) {
      return value
    } else {
      return value.toString()
    }
  }
}

const TRANSFORMER = new TimestampTransformer()
