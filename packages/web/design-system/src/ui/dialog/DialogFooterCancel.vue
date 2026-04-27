<script setup lang="ts">
import { DialogClose as RekaDialogClose } from 'reka-ui'

import Button from '@/ui/button/button/Button.vue'
import type { DialogFooterButtonProps } from '@/ui/dialog/dialogFooterButton.props'

const props = withDefaults(defineProps<DialogFooterButtonProps>(), {
  isDisabled: false,
  isLoading: false,
  disabledReason: null,
  form: null,
  iconLeft: null,
  iconRight: null,
  type: 'button',
})

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <RekaDialogClose
    :as-child="true"
  >
    <Button
      v-bind="props"
      variant="secondary"
      @click="emit('click')"
    />
  </RekaDialogClose>
</template>
