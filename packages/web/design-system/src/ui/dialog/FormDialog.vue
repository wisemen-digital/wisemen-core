<script setup lang="ts">
import {
  computed,
  useId,
} from 'vue'

import Dialog from '@/ui/dialog/Dialog.vue'
import { useProvideFormDialogContext } from '@/ui/dialog/formDialog.context'
import type { FormDialogProps } from '@/ui/dialog/formDialog.props'
import Form from '@/ui/form/Form.vue'

const props = withDefaults(defineProps<FormDialogProps>(), {
  preventClickOutside: false,
  preventEsc: false,
  promptOnUnsavedChanges: false,
  showCloseButton: true,
  size: 'md',
})

const emit = defineEmits<{
  close: []
}>()

const id = useId()

useProvideFormDialogContext({
  formId: id,
  form: props.form,
  promptOnUnsavedChanges: computed<boolean>(() => props.promptOnUnsavedChanges ?? false),
})

function onClose(): void {
  emit('close')
}
</script>

<template>
  <Dialog
    :has-close-button="props.showCloseButton"
    :size="props.size"
    :prevent-click-outside="props.preventClickOutside"
    :prevent-esc="props.preventEsc"
    @close="onClose"
  >
    <slot
      v-if="props.renderOwnFormComponent"
      :form-id="id"
    />

    <Form
      v-else
      :form="props.form"
      :prompt-on-unsaved-changes="false"
      class="flex size-full flex-col overflow-hidden"
    >
      <slot :form-id="id" />
    </Form>
  </Dialog>
</template>
