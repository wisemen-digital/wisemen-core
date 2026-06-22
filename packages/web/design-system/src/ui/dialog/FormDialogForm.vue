<script setup lang="ts">
import { useInjectFormDialogContext } from '@/ui/dialog/formDialog.context'
import { UIForm } from '@/ui/form'

const formDialogContext = useInjectFormDialogContext()
</script>

<template>
  <UIForm
    :id="formDialogContext.formId"
    :form="formDialogContext.form"
    :prompt-on-unsaved-changes="false"
  >
    <slot
      :form-id="formDialogContext.formId"
    />
  </UIForm>
</template>
