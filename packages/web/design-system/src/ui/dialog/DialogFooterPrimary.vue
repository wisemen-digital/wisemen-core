<script setup lang="ts">
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
  <Button
    v-bind="props"
    variant="primary"
    @click="emit('click')"
  />
</template>
