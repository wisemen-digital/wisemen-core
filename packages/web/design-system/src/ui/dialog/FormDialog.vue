<script setup lang="ts">
import { AlertTriangleIcon } from '@wisemen/vue-core-icons'
import {
  computed,
  useId,
  watch,
} from 'vue'
import { useI18n } from 'vue-i18n'

import Dialog from '@/ui/dialog/Dialog.vue'
import type { ChinConfig } from '@/ui/dialog/dialogChin.composable'
import { useDialogChin } from '@/ui/dialog/dialogChin.composable'
import { useProvideFormDialogContext } from '@/ui/dialog/formDialog.context'
import type { FormDialogProps } from '@/ui/dialog/formDialog.props'
import Form from '@/ui/form/Form.vue'

const props = withDefaults(defineProps<FormDialogProps>(), {
  preventClickOutside: false,
  preventEsc: false,
  promptOnUnsavedChanges: true,
  showCloseButton: true,
  size: 'md',
  unsavedChangesText: null,
})

const emit = defineEmits<{
  close: []
}>()

const i18n = useI18n()
const isOpen = defineModel<boolean>('isOpen', {
  default: false,
})

const id = useId()
const dialogChin = useDialogChin()
let chinPulseKey = 0

useProvideFormDialogContext({
  formId: id,
  form: props.form,
})

const resolvedChin = computed<ChinConfig | null>(() => dialogChin.chin.value ?? props.chin ?? null)

const dialogOpenState = computed<boolean>({
  get: () => isOpen.value,
  set: (value) => {
    if (value) {
      isOpen.value = true

      return
    }

    if (props.promptOnUnsavedChanges && props.form.isDirty.value) {
      openInvalidCloseChin()

      return
    }

    closeInvalidCloseChin()
    isOpen.value = false
    emit('close')
  },
})

function closeInvalidCloseChin(): void {
  dialogChin.close()
}

function getNextChinPulseKey(): number {
  chinPulseKey += 1

  return chinPulseKey
}

function createInvalidCloseChinConfig(pulseKey?: number | string | null): ChinConfig {
  return {
    icon: AlertTriangleIcon,
    pulseKey,
    text: props.unsavedChangesText ?? i18n.t('component.form_dialog.unsaved_changes'),
    variant: 'error',
  }
}

function openInvalidCloseChin(): void {
  props.form.blurAll()

  if (dialogChin.chin.value !== null) {
    dialogChin.open(createInvalidCloseChinConfig(getNextChinPulseKey()))

    return
  }

  dialogChin.open(createInvalidCloseChinConfig())
}

watch(() => props.form.state.value, () => {
  if (dialogChin.chin.value === null) {
    return
  }

  closeInvalidCloseChin()
}, {
  deep: true,
})

watch(() => isOpen.value, (value) => {
  if (value) {
    return
  }

  closeInvalidCloseChin()
})
</script>

<template>
  <Dialog
    v-model:is-open="dialogOpenState"
    :chin="resolvedChin"
    :show-close-button="props.showCloseButton"
    :size="props.size"
    :prevent-click-outside="props.preventClickOutside"
    :prevent-esc="props.preventEsc"
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
