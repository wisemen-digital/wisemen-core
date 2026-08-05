<script setup lang="ts">
import {
  computed,
  useId,
} from 'vue'

import { useUnsavedChanges } from '@/composables/unsaved-changes/unsavedChanges.composable'
import { useProvideFormContext } from '@/ui/form/form.context'
import type { FormProps } from '@/ui/form/form.props'

const props = withDefaults(defineProps<FormProps>(), {
  id: null,
  isUnsavedChangesPromptEnabled: true,
  promptOnUnsavedChanges: true,
})

const id = useId()

const isUnsavedChangesPromptEnabled = computed<boolean>(
  () => props.promptOnUnsavedChanges !== true ? false : props.isUnsavedChangesPromptEnabled,
)

if (isUnsavedChangesPromptEnabled.value) {
  useUnsavedChanges(props.form.isDirty)
}

useProvideFormContext({
  formId: props.id ?? id,
  form: props.form,
})
</script>

<template>
  <form
    :id="props.id ?? id"
    :novalidate="true"
    @submit.prevent="props.form.submit()"
  >
    <slot />
  </form>
</template>
