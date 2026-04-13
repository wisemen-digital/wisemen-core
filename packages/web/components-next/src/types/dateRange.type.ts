import type { Temporal } from 'temporal-polyfill'

export interface DateRange<TValue extends Date | Temporal.PlainDate = Temporal.PlainDate> {
  from: TValue | null
  until: TValue | null
}
