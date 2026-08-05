import { getPayload } from '@wisemen/payload-core-utils'

import type {
  FormDocument,
  FormFieldDefinition,
  FormSubmissionDocument,
  SubmissionValue,
  SubmitFormInput,
} from '#types.ts'

function asForm(document: unknown): FormDocument {
  const form = document as Partial<FormDocument>

  if (!form.id || !form.slug || !Array.isArray(form.fields)) {
    throw new Error('The requested form is invalid or does not exist.')
  }

  return form as FormDocument
}

function normalizeValue(field: FormFieldDefinition, value: unknown): SubmissionValue['value'] {
  if (value === undefined || value === null || value === '') {
    return null
  }
  if (field.blockType === 'checkbox') {
    if (typeof value !== 'boolean') {
      throw new TypeError(`${field.label} must be a boolean.`)
    }

    return value
  }
  if (field.blockType === 'number') {
    const number = typeof value === 'number' ? value : Number(value)

    if (!Number.isFinite(number)) {
      throw new TypeError(`${field.label} must be a number.`)
    }

    return number
  }
  if (typeof value !== 'string') {
    throw new TypeError(`${field.label} must be a string.`)
  }
  if ((field.blockType === 'select' || field.blockType === 'radio') && !field.options?.some((option) => option.value === value)) {
    throw new Error(`${field.label} has an invalid option.`)
  }
  if (field.blockType === 'email' && !/^\S[^\s@]*@\S[^\s.]*\.\S+$/.test(value)) {
    throw new Error(`${field.label} must be a valid email address.`)
  }

  return value
}

function makeSubmissionValues(fields: FormFieldDefinition[], input: Record<string, unknown>): SubmissionValue[] {
  const names = new Set<string>()

  return fields.map((field) => {
    if (!/^[a-z][a-zA-Z0-9]*$/.test(field.name) || names.has(field.name)) {
      throw new Error(`Form contains an invalid or duplicate field name: ${field.name}`)
    }

    names.add(field.name)

    const value = normalizeValue(field, input[field.name])

    if (field.required && (value === null || value === false)) {
      throw new Error(`${field.label} is required.`)
    }

    return {
      name: field.name,
      label: field.label,
      value,
    }
  })
}

export async function submitForm(
  input: SubmitFormInput,
): Promise<FormSubmissionDocument> {
  const payload = await getPayload()
  const formsSlug = 'forms'
  const submissionsSlug = 'form-submissions'
  const bySlug = await payload.find({
    collection: formsSlug,
    depth: 0,
    fallbackLocale: false,
    limit: 1,
    locale: input.locale,
    overrideAccess: true,
    where: {
      slug: {
        equals: input.form,
      },
    },
  })
  const source = bySlug.docs[0] ?? await payload.findByID({
    id: input.form,
    collection: formsSlug,
    depth: 0,
    fallbackLocale: false,
    locale: input.locale,
    overrideAccess: true,
  })
  const form = asForm(source)
  const values = makeSubmissionValues(form.fields, input.data)
  const submission = await payload.create({
    collection: submissionsSlug,
    data: {
      submittedAt: new Date().toISOString(),
      data: values,
      form: form.id,
    },
    overrideAccess: true,
  }) as FormSubmissionDocument

  return submission
}
