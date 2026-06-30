import type { Form } from 'formango'

import { useContext } from '@/composables/context.composable'

interface FormDialogContext {
  formId: string
  form: Form<any>
}

export const [
  useProvideFormDialogContext,
  useInjectFormDialogContext,
] = useContext<FormDialogContext>('formDialogContext')
