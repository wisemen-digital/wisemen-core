<script setup lang="ts">
import { useInjectFormDialogContext } from '@/ui/dialog/formDialog.context'
import { UIForm } from '@/ui/form'

const {
  formId,
  form,
  promptOnUnsavedChanges,
} = useInjectFormDialogContext()
</script>

<template>
  <UIForm
    v-ele
    :id="formId"
    :form="form"
    :prompt-on-unsaved-changes="promptOnUnsavedChanges"
  >
    <slot
      :form-id="formId"
    />
  </UIForm>
</template>
