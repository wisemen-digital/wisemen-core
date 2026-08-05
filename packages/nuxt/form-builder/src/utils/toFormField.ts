import type { Field } from 'formango'

export interface FormFieldBinding {
  'isTouched': boolean | undefined
  'errorMessage': string | null
  'modelValue': any
  'onBlur': () => void
  'onUpdate:modelValue': (value: any) => void
}

/** Maps Formango field state to the v-model contract used by Nuxt UI inputs. */
export function toFormField(field: Field<any, any>): FormFieldBinding {
  return {
    'isTouched': field.isTouched.value,
    'errorMessage': field.errors.value.map((error) => error.message)[0] ?? null,
    'modelValue': field.modelValue.value ?? undefined,
    'onBlur': field.onBlur,
    'onUpdate:modelValue': field['onUpdate:modelValue'],
  }
}
