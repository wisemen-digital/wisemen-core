<script setup lang="ts">
import { useId } from 'vue'

import Dialog from '@/ui/dialog/Dialog.vue'
import type { FormDialogProps } from '@/ui/dialog/formDialog.props'
import FormComponent from '@/ui/form/Form.vue'

const props = withDefaults(defineProps<FormDialogProps>(), {
  hasCloseButton: true,
  preventClickOutside: false,
  preventEsc: false,
  promptOnUnsavedChanges: false,
  renderOwnFormComponent: false,
  size: 'md',
})

const emit = defineEmits<{
  close: []
}>()

const id = useId()

function onClose(): void {
  emit('close')
}
</script>

<template>
  <Dialog
    :has-close-button="props.hasCloseButton"
    :size="props.size"
    :prevent-click-outside="props.preventClickOutside"
    :prevent-esc="props.preventEsc"
    @close="onClose"
  >
    <slot
      v-if="props.renderOwnFormComponent"
      :form-id="id"
    />
    <FormComponent
      v-else
      :form="props.form"
      :prompt-on-unsaved-changes="props.promptOnUnsavedChanges"
    >
      <slot
        :form-id="id"
      />
    </FormComponent>
  </Dialog>
</template>
