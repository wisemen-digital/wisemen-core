import type { Field } from 'formango'

export function toFormField<TValue, TDefaultValue>(field: Field<TValue, TDefaultValue>): {
  'isTouched': boolean
  'errorMessage': string | null
  'modelValue': TDefaultValue extends undefined ? TValue | null : TValue
  'onBlur': () => void
  'onUpdate:modelValue': (value: TValue | null) => void
} {
  return {
    'isTouched': field.isTouched.value,
    'errorMessage': field.isTouched.value ? field.errors.value?.[0]?.message ?? null : null,
    'modelValue': field.modelValue.value,
    'onBlur': field.onBlur,
    'onUpdate:modelValue': field['onUpdate:modelValue'],
  }
}
