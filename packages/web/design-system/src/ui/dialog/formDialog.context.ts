import type { Form } from 'formango'
import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'

interface FormDialogContext {
  formId: string
  form: Form<any>
  promptOnUnsavedChanges: ComputedRef<boolean>
}

export const [
  useProvideFormDialogContext,
  useInjectFormDialogContext,
] = useContext<FormDialogContext>('formDialogContext')
