<script setup lang="ts">
import { DialogClose as RekaDialogClose } from 'reka-ui'
import { useI18n } from 'vue-i18n'

import Button from '@/ui/button/button/Button.vue'
import type { DialogFooterButtonProps } from '@/ui/dialog/dialogFooterButton.props'

const props = withDefaults(defineProps<Omit<DialogFooterButtonProps, 'label'> & { label?: string | null }>(), {
  isDisabled: false,
  isLoading: false,
  disabledReason: null,
  form: null,
  iconLeft: null,
  iconRight: null,
  label: null,
  type: 'button',
})

const emit = defineEmits<{
  click: []
}>()

const i18n = useI18n()
</script>

<template>
  <RekaDialogClose
    :as-child="true"
  >
    <Button
      v-bind="props"
      :label="props.label ?? i18n.t('component.dialog.cancel')"
      variant="secondary"
      @click="emit('click')"
    />
  </RekaDialogClose>
</template>
