<script setup lang="ts">
import { computed } from 'vue'

import { UIAutoFocus } from '@/ui/auto-focus'
import Button from '@/ui/button/button/Button.vue'
import type { DialogFooterButtonProps } from '@/ui/dialog/dialogFooterButton.props'

const props = withDefaults(defineProps<DialogFooterButtonProps>(), {
  isAutoFocusDisabled: false,
  isDestructive: false,
  isDisabled: false,
  isLoading: false,
  disabledReason: null,
  form: null,
  iconLeft: null,
  iconRight: null,
  type: 'button',
})

const isAutoFocusDisabled = computed(() => props.isAutoFocusDisabled || props.disableAutoFocus)

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <UIAutoFocus :is-disabled="isAutoFocusDisabled">
    <Button
      v-bind="props"
      :variant="props.isDestructive ? 'destructive-primary' : 'primary'"
      @click="emit('click')"
    />
  </UIAutoFocus>
</template>
