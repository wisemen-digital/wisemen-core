import { Temporal } from 'temporal-polyfill'
import z from 'zod'

export const plainTimeFieldSchema = z.instanceof(Temporal.PlainTime, {
  error: () => 'Invalid time format',
})

export type PlainTimeField = z.infer<typeof plainTimeFieldSchema>
