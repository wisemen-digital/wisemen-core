<script setup lang="ts" generic="TResult = unknown">
import UCheckbox from '@nuxt/ui/components/Checkbox.vue'
import UForm from '@nuxt/ui/components/Form.vue'
import UInput from '@nuxt/ui/components/Input.vue'
import URadioGroup from '@nuxt/ui/components/RadioGroup.vue'
import USelect from '@nuxt/ui/components/Select.vue'
import UTextarea from '@nuxt/ui/components/Textarea.vue'
import type { FormFieldDefinition } from '@wisemen/payload-core-form-builder'
import type { Field } from 'formango'
import { useForm } from 'formango'
import { ref } from 'vue'

import { toFormField } from '#utils/toFormField.ts'
import { toZodSchema } from '#utils/toZodSchema.ts'

import type {
  FormSubmitHandler,
  FormValues,
  RenderableForm,
} from '../types'
import FormButton from './FormButton.vue'
import FormField from './FormField.vue'
import FormRow from './FormRow.vue'
import FormSuccessState from './FormSuccessState.vue'

const props = withDefaults(defineProps<{
  form: RenderableForm
  showSuccessState?: boolean
  submit: FormSubmitHandler<TResult>
}>(), {
  showSuccessState: true,
})

const emit = defineEmits<{
  error: [error: unknown]
  submitted: [result: TResult]
}>()

const hasSuccessfullySubmitted = ref(false)
const fields = props.form.fields ?? []

function initialValue(field: FormFieldDefinition): FormValues[string] {
  if (field.defaultValue !== undefined) {
    return field.defaultValue
  }

  return field.blockType === 'checkbox' ? false : null
}

const schema = toZodSchema(fields)
const initialState = Object.fromEntries(fields.map((field) => [
  field.name,
  initialValue(field),
]))

const form = useForm({
  initialState,
  schema,
  onSubmit: async (values) => {
    try {
      const normalizedValues = Object.fromEntries(fields.map((field) => {
        const value = values[field.name]

        return [
          field.name,
          field.blockType === 'number' && value !== null && value !== '' ? Number(value) : value,
        ]
      })) as FormValues
      const result = await props.submit(normalizedValues)

      hasSuccessfullySubmitted.value = true
      emit('submitted', result)
    }
    catch (error) {
      emit('error', error)
    }
  },
})

const registeredFields = fields.map((definition) => ({
  definition,
  field: form.register(definition.name),
}))

function updateCheckbox(field: Field<any, any>, value: boolean | 'indeterminate'): void {
  field['onUpdate:modelValue'](value === true)
}
</script>

<template>
  <UForm
    @submit="form.submit()"
  >
    <FormSuccessState
      :is-success="hasSuccessfullySubmitted && showSuccessState"
      :success-text="props.form.confirmation?.successMessage ?? 'Thank you. We received your submission.'"
    >
      <div class="flex flex-col gap-lg">
        <header
          v-if="props.form.title || props.form.description"
          class="flex flex-col gap-xs"
        >
          <h2
            v-if="props.form.title"
            class="text-xl font-semibold text-highlighted"
          >
            {{ props.form.title }}
          </h2>
          <p
            v-if="props.form.description"
            class="text-muted"
          >
            {{ props.form.description }}
          </p>
        </header>

        <FormRow>
          <FormField
            v-for="entry in registeredFields"
            :key="entry.definition.name"
            v-bind="toFormField(entry.field)"
            :class="entry.definition.width === 'half' ? 'sm:col-span-1' : 'sm:col-span-2'"
            :is-required="entry.definition.required === true"
            :help="entry.definition.blockType === 'checkbox' ? undefined : entry.definition.helpText"
            :label="entry.definition.label"
          >
            <UTextarea
              v-if="entry.definition.blockType === 'textarea'"
              :placeholder="entry.definition.placeholder ?? undefined"
              :rows="5"
              class="w-full"
              v-bind="toFormField(entry.field)"
            />
            <UCheckbox
              v-else-if="entry.definition.blockType === 'checkbox'"
              :label="entry.definition.helpText ?? undefined"
              :model-value="entry.field.modelValue.value === true"
              @update:model-value="(value: boolean | 'indeterminate') => updateCheckbox(entry.field, value)"
            />
            <URadioGroup
              v-else-if="entry.definition.blockType === 'radio'"
              :items="entry.definition.options ?? []"
              v-bind="toFormField(entry.field)"
            />
            <USelect
              v-else-if="entry.definition.blockType === 'select'"
              :items="entry.definition.options ?? []"
              :placeholder="entry.definition.placeholder ?? undefined"
              class="w-full"
              v-bind="toFormField(entry.field)"
            />
            <UInput
              v-else
              :placeholder="entry.definition.placeholder ?? undefined"
              :type="entry.definition.blockType === 'number' ? 'number' : entry.definition.blockType"
              class="w-full"
              v-bind="toFormField(entry.field)"
            />
          </FormField>
        </FormRow>

        <slot
          :is-submitting="form.isSubmitting.value"
          :submit="form.submit"
          name="actions"
        >
          <FormButton
            :label="props.form.confirmation?.submitLabel ?? 'Send'"
            :loading="form.isSubmitting.value"
          />
        </slot>
      </div>
    </FormSuccessState>
  </UForm>
</template>
