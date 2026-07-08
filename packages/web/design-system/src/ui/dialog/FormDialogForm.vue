<script setup lang="ts">
import { useInjectFormDialogContext } from '@/ui/dialog/formDialog.context'
import { UIForm } from '@/ui/form'

const formDialogContext = useInjectFormDialogContext()
</script>

<template>
  <UIForm
    :id="formDialogContext.formId"
    :form="formDialogContext.form"
    :is-unsaved-changes-prompt-enabled="false"
  >
    <slot
      :form-id="formDialogContext.formId"
    />
  </UIForm>
</template>
