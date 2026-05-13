<script setup lang="ts">
import { useHotkey } from '@tanstack/vue-hotkeys'

import { UIButton } from '@/ui/button'
import type { DialogFooterButtonProps } from '@/ui/dialog/dialogFooterButton.props'
import { useInjectFormContext } from '@/ui/form'

const props = withDefaults(defineProps<DialogFooterButtonProps>(), {
  isDisabled: false,
  isLoading: false,
  disabledReason: null,
  form: null,
  iconLeft: null,
  iconRight: null,
  type: 'submit',
})

const emit = defineEmits<{
  click: []
}>()

const {
  form,
} = useInjectFormContext()

useHotkey('Meta+Enter', () => {
  form.submit()
})
</script>

<template>
  <UIButton
    v-bind="props"
    :keyboard-shortcut="{
      key: 'Enter',
      meta: true,
    }"
    variant="primary"
    @click="emit('click')"
  />
</template>
