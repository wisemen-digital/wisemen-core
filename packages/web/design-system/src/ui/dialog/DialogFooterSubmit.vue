<script setup lang="ts">
import { UIButton } from '@/ui/button'
import type { DialogFooterButtonProps } from '@/ui/dialog/dialogFooterButton.props'

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
</script>

<template>
  <UIButton
    v-bind="props"
    variant="primary"
    @click="emit('click')"
  />
</template>
