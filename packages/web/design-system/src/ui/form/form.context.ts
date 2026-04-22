import type { Form } from 'formango'

import { useContext } from '@/composables/context.composable'

interface FormContext {
  formId: string
  form: Form<any>
}

export const [
  useProvideFormContext,
  useInjectFormContext,
] = useContext<FormContext>('formContext')
