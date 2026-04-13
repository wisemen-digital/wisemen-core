import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { FormFieldProps } from '@/components/form-field/formField.props'
import type { CreateFormFieldStyle } from '@/components/form-field/formField.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface FormFieldContext extends PropsToComputed<FormFieldProps> {
  customClassConfig: ComputedRef<ResolvedClassConfig<'formField'>>
  style: ComputedRef<CreateFormFieldStyle>

}

export const [
  useProvideFormFieldContext,
  useInjectFormFieldContext,
] = useContext<FormFieldContext>('formFieldContext')
