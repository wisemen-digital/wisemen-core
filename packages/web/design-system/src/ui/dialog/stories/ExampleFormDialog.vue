<script setup lang="ts">
import { useForm } from 'formango'
import { computed } from 'vue'
import z from 'zod'

import DialogBody from '@/ui/dialog/DialogBody.vue'
import type { ChinConfig } from '@/ui/dialog/dialogChin.composable'
import DialogFooter from '@/ui/dialog/DialogFooter.vue'
import DialogFooterCancel from '@/ui/dialog/DialogFooterCancel.vue'
import DialogFooterSubmit from '@/ui/dialog/DialogFooterSubmit.vue'
import DialogHeader from '@/ui/dialog/DialogHeader.vue'
import FormDialog from '@/ui/dialog/FormDialog.vue'
import TextField from '@/ui/text-field/TextField.vue'
import { toFormField } from '@/utils/toFormField.util'

const props = withDefaults(defineProps<{
  isOpen?: boolean
  promptOnUnsavedChanges?: boolean
  showExternalChin?: boolean
  unsavedChangesText?: string | null
}>(), {
  isOpen: false,
  promptOnUnsavedChanges: true,
  showExternalChin: false,
  unsavedChangesText: null,
})

const emit = defineEmits<{
  close: []
}>()

const form = useForm({
  schema: z.object({
    name: z.string().min(2, 'Enter at least 2 characters'),
  }),
  onSubmit: () => {
    emit('close')
  },
})

const nameField = form.register('name', '')

const chin = computed<ChinConfig | null>(() => {
  if (!props.showExternalChin) {
    return null
  }

  return {
    text: 'External chin message',
    variant: 'default',
  }
})
</script>

<template>
  <FormDialog
    :is-open="props.isOpen"
    :chin="chin"
    :form="form"
    :prompt-on-unsaved-changes="props.promptOnUnsavedChanges"
    :unsaved-changes-text="props.unsavedChangesText"
    size="xs"
    @close="emit('close')"
  >
    <DialogHeader
      title="Edit profile"
      description="Update the required fields before closing this dialog."
    />

    <DialogBody>
      <div class="flex flex-col gap-md">
        <TextField
          v-bind="toFormField(nameField)"
          :is-required="true"
          label="Name"
          placeholder="Enter a name"
        />
      </div>
    </DialogBody>

    <DialogFooter>
      <DialogFooterCancel />
      <DialogFooterSubmit label="Save" />
    </DialogFooter>
  </FormDialog>
</template>
