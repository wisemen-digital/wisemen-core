import type {
  CollectionConfig,
  Payload,
  PayloadRequest,
} from 'payload'

export const FORM_FIELD_TYPES = [
  'text',
  'email',
  'textarea',
  'number',
  'date',
  'select',
  'radio',
  'checkbox',
] as const

export type FormFieldType = (typeof FORM_FIELD_TYPES)[number]

export interface FormChoice {
  label: string
  value: string
}

/** The stable, frontend-friendly shape stored in a form document. */
export interface FormFieldDefinition {
  name: string
  blockType: FormFieldType
  defaultValue?: boolean | number | string | null
  helpText?: string | null
  label: string
  options?: FormChoice[] | null
  placeholder?: string | null
  required?: boolean | null
  width?: 'full' | 'half' | null
}

export interface FormDocument {
  id: string
  title: string
  confirmation?: {
    submitLabel?: string | null
    successMessage?: string | null
  } | null
  description?: string | null
  fields: FormFieldDefinition[]
  slug: string
}

/** Labels are snapshotted so historic submissions remain readable after a form changes. */
export interface SubmissionValue {
  name: string
  label: string
  value: boolean | number | string | string[] | null
}

export interface FormSubmissionDocument {
  id: string
  submittedAt: string
  data: SubmissionValue[]
  form: string | FormDocument
}

export interface FormSubmissionEvent {
  form: FormDocument
  payload: Payload
  req: PayloadRequest
  submission: FormSubmissionDocument
  values: SubmissionValue[]
}

export interface FormBuilderOptions {
  formsCollectionOverrides?: Partial<CollectionConfig>
  formsSlug?: string
  submissionsCollectionOverrides?: Partial<CollectionConfig>
  submissionsSlug?: string
  /** Invoked once, after a submission has been persisted. Queue work here for email/CRM integrations. */
  onSubmission?: (event: FormSubmissionEvent) => Promise<void> | void
}

export interface SubmitFormInput {
  data: Record<string, unknown>
  form: string
}
