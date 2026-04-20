<script setup lang="ts">
import { useId } from 'vue'

import Dialog from '@/ui/dialog/Dialog.vue'
import { useProvideFormDialogContext } from '@/ui/dialog/formDialog.context'
import type { FormDialogProps } from '@/ui/dialog/formDialog.props'

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
      :form-id="id"
    />
  </Dialog>
</template>
