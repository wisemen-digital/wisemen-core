import type { FormDocument } from '@wisemen/payload-core-form-builder'

export type FormValues = Record<string, boolean | number | string | null>

/** The only integration point required by the renderer. */
export type FormSubmitHandler<TResult = unknown> = (values: FormValues) => Promise<TResult>

export interface RenderableForm extends FormDocument {
  confirmation?: {
    submitLabel?: string | null
    successMessage?: string | null
  } | null
}
