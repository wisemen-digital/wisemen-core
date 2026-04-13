import { Column, ColumnOptions } from 'typeorm'
import { WiseDate } from './wise-date.js'
import { wiseDate } from './wise-date.factory.js'

export type CoordinatesColumnOptions = Omit<ColumnOptions, 'type' | 'transformer'>

export function WiseDateColumn (options?: CoordinatesColumnOptions): PropertyDecorator {
  return Column({
    ...options,
    type: 'date',
    transformer: WiseDateTransformer.getInstance()
  })
}

class WiseDateTransformer {
  private static instance: WiseDateTransformer | undefined

  public static getInstance (): WiseDateTransformer {
    if (WiseDateTransformer.instance === undefined) {
      WiseDateTransformer.instance = new WiseDateTransformer()
    }

    return WiseDateTransformer.instance
  }

  from (value: string | number | null): WiseDate | null {
    if (value === null) {
      return null
    } else {
      return wiseDate(value)
    }
  }

  to (value: WiseDate | null | undefined): string | null {
    return value?.toString() ?? null
  }
}
