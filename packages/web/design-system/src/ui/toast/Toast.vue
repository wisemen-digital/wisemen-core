<script setup lang="ts">
import { UIColumnLayout } from '@/ui/column-layout/index'
import { UIRowLayout } from '@/ui/row-layout/index'
import { UIText } from '@/ui/text/index'
import type { Toast } from '@/ui/toast/toast.type'

import ToastActions from '@/ui/toast/ToastActions.vue'
import ToastCloseButton from '@/ui/toast/ToastCloseButton.vue'
import ToastIcon from '@/ui/toast/ToastIcon.vue'
import ToastLayout from '@/ui/toast/ToastLayout.vue'
import ToastLoader from '@/ui/toast/ToastLoader.vue'
import ToastMessage from '@/ui/toast/ToastMessage.vue'

const props = defineProps<{
  toast: Toast
}>()

const emit = defineEmits<{
  closeToast: []
}>()
</script>

<template>
  <ToastLayout :data-toast-id="props.toast.id">
    <ToastCloseButton
      v-if="(props.toast.dismissible ?? true) && props.toast.variant !== 'loading'"
      @close="emit('closeToast')"
    />

    <UIRowLayout
      align="start"
      class="pr-3xl"
    >
      <ToastLoader v-if="props.toast.variant === 'loading'" />

      <ToastIcon
        v-else-if="props.toast.icon !== undefined"
        :icon="props.toast.icon"
        :variant="props.toast.variant"
      />

      <UIColumnLayout gap="none">
        <UIText
          v-if="props.toast.title !== undefined"
          :text="props.toast.title"
          :class="{
            'text-error-primary': props.toast.variant === 'error',
            'text-warning-primary': props.toast.variant === 'warning',
            'text-primary': props.toast.variant === 'info' || props.toast.variant === 'loading' || props.toast.variant === undefined,
          }"
          class="mb-xs text-sm font-medium"
        />

        <ToastMessage
          :models="props.toast.interactableModels ?? {}"
          :message="props.toast.message"
          @close-toast="emit('closeToast')"
        />

        <ToastActions
          :button="props.toast.button"
          :link="props.toast.link"
          class="mt-lg"
          @close="emit('closeToast')"
        />
      </UIColumnLayout>
    </UIRowLayout>
  </ToastLayout>
</template>

<style scoped>
@keyframes toast-highlight {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.animate-toast-highlight {
  animation: toast-highlight 600ms;
}
</style>
