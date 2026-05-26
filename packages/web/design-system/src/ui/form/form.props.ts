import type { Form } from 'formango'

export interface FormProps {
  id?: string | null
  form: Form<any>
  promptOnUnsavedChanges: boolean
}
