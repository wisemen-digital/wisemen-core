<script setup lang="ts">
import { UIAutoFocus } from '@/ui/auto-focus'
import Button from '@/ui/button/button/Button.vue'
import type { DialogFooterButtonProps } from '@/ui/dialog/dialogFooterButton.props'

const props = withDefaults(defineProps<DialogFooterButtonProps>(), {
  isDestructive: false,
  isDisabled: false,
  isLoading: false,
  disableAutoFocus: false,
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
  <UIAutoFocus :is-disabled="props.disableAutoFocus">
    <Button
      v-bind="props"
      :variant="props.isDestructive ? 'destructive-primary' : 'primary'"
      @click="emit('click')"
    />
  </UIAutoFocus>
</template>
