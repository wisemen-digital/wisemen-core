import { Temporal } from 'temporal-polyfill'
import z from 'zod'

import { plainDateFieldSchema } from '#models/form/plainDateField.model.ts'
import { plainTimeFieldSchema } from '#models/form/plainTimeField.model.ts'
import type { PlainDate } from '#models/plainDate.model.ts'
import type { PlainTime } from '#models/plainTime.model.ts'

export const dateAndTimeSchema = z.object({
  date: plainDateFieldSchema,
  time: plainTimeFieldSchema,
})

export const nullableDateAndTimeSchema = z.object({
  date: plainDateFieldSchema.nullable(),
  time: plainTimeFieldSchema.nullable(),
}).superRefine((
  {
    date, time,
  },
  ctx,
) => {
  if ((date === null) !== (time === null)) {
    ctx.addIssue({
      code: 'custom',
      message: 'Date and time must both be filled in or both be empty',
      path: [
        date === null ? 'date' : 'time',
      ],
    })
  }
})

export type DateAndTime = z.infer<typeof dateAndTimeSchema>

function toPlainDateTime(dt: {
  date: PlainDate
  time: PlainTime
}): Temporal.PlainDateTime {
  return Temporal.PlainDate.from(dt.date).toPlainDateTime(Temporal.PlainTime.from(dt.time))
}

function isABeforeB(a: DateAndTime, b: DateAndTime): boolean {
  return toPlainDateTime(a).since(toPlainDateTime(b)).total('seconds') < 0
}

export const dateTimeInstantRangeFieldSchema = z
  .object({
    from: dateAndTimeSchema,
    until: dateAndTimeSchema,
  })
  .superRefine(
    ({
      from, until,
    }, ctx) => {
      if (!isABeforeB(from, until)) {
        ctx.addIssue({
          code: 'custom',
          message: 'End date/time must be after start date/time',
          path: [
            'until',
            'time',
          ],
        })
      }
    },
  )

export const nullableDateTimeInstantRangeFieldSchema = z
  .object({
    from: nullableDateAndTimeSchema,
    until: nullableDateAndTimeSchema,
  })
  .superRefine(
    ({
      from, until,
    }, ctx) => {
      if (from.date === null || from.time === null || until.date === null || until.time === null) {
        return // If either start or end is null, we consider it valid (no range to compare)
      }

      if (!isABeforeB(from as DateAndTime, until as DateAndTime)) {
        ctx.addIssue({
          code: 'custom',
          message: 'End date/time must be after start date/time',
          path: [
            'until',
            'time',
          ],
        })
      }
    },
  )

export const dateTimeInstantRangeWithNullableStartField = z
  .object({
    from: nullableDateAndTimeSchema,
    until: dateAndTimeSchema,
  })
  .superRefine(
    ({
      from, until,
    }, ctx) => {
      if (from.time === null || until.date === null) {
        return // If start is infinity, we consider it valid (no range to compare)
      }

      if (!isABeforeB(from as DateAndTime, until)) {
        ctx.addIssue({
          code: 'custom',
          message: 'End date/time must be after start date/time',
          path: [
            'until',
            'time',
          ],
        })
      }
    },
  )

export const dateTimeInstantRangeWithNullableEndField = z
  .object({
    from: dateAndTimeSchema,
    until: nullableDateAndTimeSchema,
  })
  .superRefine(
    ({
      from, until,
    }, ctx) => {
      if (until.date === null || until.time === null) {
        return // If end is infinity, we consider it valid (no range to compare)
      }

      if (!isABeforeB(from, until as DateAndTime)) {
        ctx.addIssue({
          code: 'custom',
          message: 'End date/time must be after start date/time',
          path: [
            'until',
            'time',
          ],
        })
      }
    },
  )

export type DateTimeInstantRangeField = z.infer<typeof dateTimeInstantRangeFieldSchema>
export type NullableDateTimeInstantRangeField = z.infer<typeof nullableDateTimeInstantRangeFieldSchema>
export type DateTimeInstantRangeWithNullableStartField = z.infer<typeof dateTimeInstantRangeWithNullableStartField>
export type DateTimeInstantRangeWithNullableEndField = z.infer<typeof dateTimeInstantRangeWithNullableEndField>
export type NullableDateAndTimeSchema = z.infer<typeof nullableDateAndTimeSchema>
