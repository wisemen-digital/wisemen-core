<script setup lang="ts">
import { ref } from 'vue'

import type { BaseFileInfo } from '@/ui/base-file-upload'
import { UIFormFieldGrid } from '@/ui/field'
import FormFileUpload from '@/ui/form-file-upload/FormFileUpload.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isRequired?: boolean
  accept?: string[]
  description?: string
  errorMessage?: string | null
  hideErrorMessage?: boolean
  hint?: string | null
  label?: string
  mode?: 'multiple' | 'single'
}>(), {
  isDisabled: false,
  isRequired: false,
  accept: () => [
    'image/*',
    'application/pdf',
    'text/plain',
  ],
  description: 'Images, PDFs, and text files are supported.',
  errorMessage: null,
  hideErrorMessage: false,
  hint: 'Drop files anywhere on the field or paste an image from your clipboard.',
  label: 'Files',
  mode: 'single',
})

const singleValue = ref<BaseFileInfo | null>(null)
const multipleValue = ref<BaseFileInfo[]>([])
</script>

<template>
  <UIFormFieldGrid
    :lg="1"
    :sm="1"
    class="max-w-180"
  >
    <FormFileUpload
      v-if="props.mode === 'single'"
      v-model="singleValue"
      :accept="props.accept"
      :description="props.description"
      :error-message="props.errorMessage"
      :hide-error-message="props.hideErrorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :is-required="props.isRequired"
      :label="props.label"
      name="storybook-file-upload"
      data-testid="form-file-upload"
    />

    <FormFileUpload
      v-else
      v-model="multipleValue"
      :accept="props.accept"
      :description="props.description"
      :error-message="props.errorMessage"
      :hide-error-message="props.hideErrorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :is-required="props.isRequired"
      :label="props.label"
      name="storybook-file-upload"
      data-testid="form-file-upload"
    />
  </UIFormFieldGrid>
</template>
