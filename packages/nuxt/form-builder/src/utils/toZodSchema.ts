/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
import type { FormFieldDefinition } from '@wisemen/payload-core-form-builder'
import { z } from 'zod'

function optional<T extends z.ZodType>(schema: T, required: boolean | null | undefined): z.ZodType {
  return required ? schema : schema.nullable().optional()
}

export function toZodSchema(fields: FormFieldDefinition[]) {
  const shape: Record<string, z.ZodType> = {}

  for (const field of fields) {
    let schema: z.ZodType

    switch (field.blockType) {
      case 'checkbox': {
        schema = field.required ? z.literal(true) : z.boolean()

        break
      }
      case 'number': {
        schema = optional(z.coerce.number().finite(), field.required)

        break
      }
      case 'select':
      case 'radio': {
        const values = field.options?.map((option) => option.value) ?? []

        schema = optional(values.length > 0 ? z.enum(values as [string, ...string[]]) : z.string(), field.required)

        break
      }
      default: {
        let string = field.blockType === 'email' ? z.email() : z.string()

        if (field.required) {
          string = string.min(1)
        }

        schema = optional(string, field.required)
      }
    }

    shape[field.name] = schema
  }

  return z.object(shape)
}
