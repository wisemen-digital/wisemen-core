import type { FormFieldDefinition } from '@wisemen/payload-core-form-builder'
import { z } from 'zod'

function optional<T extends z.ZodType>(schema: T, required: boolean | null | undefined): z.ZodType {
  return required ? schema : schema.nullable().optional()
}

/** Converts CMS field definitions into a real, inspectable Zod object schema. */
export function toZodSchema(fields: FormFieldDefinition[]) {
  const shape: Record<string, z.ZodType> = {}

  for (const field of fields) {
    let schema: z.ZodType

    if (field.blockType === 'checkbox') {
      schema = field.required ? z.literal(true) : z.boolean()
    }
    else if (field.blockType === 'number') {
      schema = optional(z.coerce.number().finite(), field.required)
    }
    else if (field.blockType === 'select' || field.blockType === 'radio') {
      const values = field.options?.map(option => option.value) ?? []
      schema = optional(values.length ? z.enum(values as [string, ...string[]]) : z.string(), field.required)
    }
    else {
      let string = field.blockType === 'email' ? z.email() : z.string()
      if (field.required) string = string.min(1)
      schema = optional(string, field.required)
    }

    shape[field.name] = schema
  }

  return z.object(shape)
}
