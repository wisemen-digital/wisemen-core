import type { Form } from 'formango'

export interface FormProps {
  id?: string | null
  isUnsavedChangesPromptEnabled?: boolean
  form: Form<any>
  /**
   * @deprecated Use `isUnsavedChangesPromptEnabled` instead.
   */
  promptOnUnsavedChanges?: boolean
}
