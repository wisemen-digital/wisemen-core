<script setup lang="ts">
import { useId } from 'vue'

import { useUnsavedChanges } from '@/composables/unsaved-changes/unsavedChanges.composable'
import { useProvideFormContext } from '@/ui/form/form.context'
import type { FormProps } from '@/ui/form/form.props'

const props = withDefaults(defineProps<FormProps>(), {
  id: null,
})

const id = useId()

if (props.promptOnUnsavedChanges) {
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
