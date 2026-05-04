<script setup lang="ts">
import { UIButton, UILink } from '@/ui/button/index'
import { UIRowLayout } from '@/ui/row-layout/index'

import type {
  ToastButtonAction,
  ToastLinkAction,
} from '@/ui/toast/toast.type'

defineProps<{
  button?: ToastButtonAction
  link?: ToastLinkAction
}>()

const emit = defineEmits<{
  close: []
}>()

function onButtonClick(action: ToastButtonAction): void {
  action.onClick()
  emit('close')
}

function onLinkClick(): void {
  emit('close')
}
</script>

<template>
  <UIRowLayout v-if="button !== undefined || link !== undefined">
    <UIButton
      v-if="button !== undefined"
      variant="secondary"
      v-bind="button"
      @click="onButtonClick(button)"
    />

    <UILink
      v-if="link !== undefined"
      variant="secondary"
      v-bind="link"
      @click="onLinkClick()"
    />
  </UIRowLayout>
</template>
