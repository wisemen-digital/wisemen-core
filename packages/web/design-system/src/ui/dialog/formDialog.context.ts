import type { Form } from 'formango'

import { useContext } from '@/composables/context.composable'

interface FormDialogContext {
  formId: string
  form: Form<any>
  promptOnUnsavedChanges: boolean
}

export const [
  useProvideFormDialogContext,
  useInjectFormDialogContext,
] = useContext<FormDialogContext>('formDialogContext')
