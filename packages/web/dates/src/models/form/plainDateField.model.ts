import { Temporal } from 'temporal-polyfill'
import z from 'zod'

export const plainDateFieldSchema = z.instanceof(Temporal.PlainDate, {
  error: () => 'Invalid date format',
})

export type PlainDateField = z.infer<typeof plainDateFieldSchema>
