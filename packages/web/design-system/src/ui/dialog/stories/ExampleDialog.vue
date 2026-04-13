<script setup lang="ts">
import {
  CheckCircleIcon,
  InfoCircleIcon,
  SearchMdIcon,
} from '@wisemen/vue-core-icons'

import { UIButton } from '@/ui/button'
import Checkbox from '@/ui/checkbox/Checkbox.vue'
import type { DialogSize } from '@/ui/dialog/dialog.props'
import Dialog from '@/ui/dialog/Dialog.vue'
import DialogBody from '@/ui/dialog/DialogBody.vue'
import { useDialogChin } from '@/ui/dialog/dialogChin.composable'
import DialogFooter from '@/ui/dialog/DialogFooter.vue'
import DialogFooterCancel from '@/ui/dialog/DialogFooterCancel.vue'
import DialogFooterPrimary from '@/ui/dialog/DialogFooterPrimary.vue'
import DialogHeader from '@/ui/dialog/DialogHeader.vue'
import TextField from '@/ui/text-field/TextField.vue'

withDefaults(defineProps<{
  isOpen?: boolean
  preventClickOutside?: boolean
  preventEsc?: boolean
  size?: DialogSize
}>(), {
  isOpen: false,
  preventClickOutside: false,
  preventEsc: false,
  size: 'md',
})

const emit = defineEmits<{
  close: []
}>()

function onClose(): void {
  emit('close')
}

const dialogChin = useDialogChin()
</script>

<template>
  <Dialog
    :chin="dialogChin.chin"
    :is-open="isOpen"
    :size="size"
    :prevent-click-outside="preventClickOutside"
    :prevent-esc="preventEsc"
    @update:is-open="!$event && $emit('close')"
  >
    <DialogHeader
      :icon="CheckCircleIcon"
      title="Modal title"
      description="This is an example dialog with some content. "
    />

    <DialogBody>
      <div class="grid grid-cols-2 gap-lg">
        <UIButton
          label="open chin"
          @click="() => {
            dialogChin.open({
              icon: InfoCircleIcon,
              text: 'You have unsaved changes. this is really long text to test the chin height. make it longer and longer and longer',
              variant: 'default',
            })
          }"
        />
        <UIButton
          label="close chin"
          @click="() => {
            dialogChin.close()
          }"
        />
        <TextField
          :model-value="null"
          :icon-left="SearchMdIcon"
          placeholder="Search..."
          label="Search"
        />
        <TextField
          :model-value="null"
          :icon-left="SearchMdIcon"
          placeholder="Search..."
          label="Search"
        />
      </div>
    </DialogBody>

    <DialogFooter>
      <template #left>
        <Checkbox
          :model-value="false"
          label="Do you like this example?"
        />
      </template>
      <template #right>
        <DialogFooterCancel
          label="Cancel"
          @click="onClose"
        />
        <DialogFooterPrimary
          label="Open dialog"
          @click="onClose"
        />
      </template>
    </DialogFooter>
  </Dialog>
</template>
