<script setup lang="ts">
import {
  DialogContent as RekaDialogContent,
  DialogOverlay as RekaDialogOverlay,
  DialogRoot as RekaDialogRoot,
} from 'reka-ui'
import { computed } from 'vue'

import { useProvideDialogContext } from '@/ui/dialog/dialog.context'
import type { DialogProps } from '@/ui/dialog/dialog.props'
import type { CreateDialogStyle } from '@/ui/dialog/dialog.style'
import { createDialogStyle } from '@/ui/dialog/dialog.style'
import DialogCloseButton from '@/ui/dialog/DialogCloseButton.vue'
import { useDialogScroll } from '@/ui/dialog/dialogScroll.composable'

const props = withDefaults(defineProps<DialogProps>(), {
  preventClickOutside: false,
  preventEsc: false,
  showCloseButton: true,
  size: 'md',
})

const emit = defineEmits<{
  'close': []
  'update:isOpen': [value: boolean]
}>()

const isOpen = defineModel<boolean>('isOpen', {
  default: false,
})

const style = computed<CreateDialogStyle>(() => createDialogStyle({
  size: props.size,
}))

const {
  isScrolledToBottom,
  isScrolledToTop,
  bodyRef,
} = useDialogScroll()

useProvideDialogContext({
  isScrolledToBottom,
  isScrolledToTop,
  bodyRef,
  style,
})

function onEscapeKeyDown(event: KeyboardEvent): void {
  if (props.preventEsc) {
    event.preventDefault()
  }
}

function onPointerDownOutside(event: Event): void {
  if (props.preventClickOutside) {
    event.preventDefault()
  }
}

function onOpenChange(value: boolean): void {
  if (!value) {
    emit('close')
  }
}
</script>

<template>
  <RekaDialogRoot
    v-model:open="isOpen"
    :modal="true"
    @update:open="onOpenChange"
  >
    <RekaDialogOverlay
      :class="style.overlay()"
      data-animation="dialog"
    />

    <RekaDialogContent
      :class="style.contentWrapper()"
      data-animation="dialog"
      @escape-key-down="onEscapeKeyDown"
      @pointer-down-outside="onPointerDownOutside"
    >
      <div :class="style.content()">
        <slot />
        <DialogCloseButton v-if="props.showCloseButton" />
      </div>
    </RekaDialogContent>
  </RekaDialogRoot>
</template>

<style>
@keyframes dialogOverlayFadeIn {
  from {
    opacity: 0;
  }
}

@keyframes dialogOverlayFadeOut {
  to {
    opacity: 0;
  }
}

@keyframes dialogContentFadeIn {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
}

@keyframes dialogContentFadeOut {
  to {
    opacity: 0;
    transform: translateY(2rem);
  }
}

[data-animation='dialog'] {
  animation-duration: 200ms;
  animation-timing-function: ease-in-out;
}

[data-animation='dialog'][data-state='open'] {
  animation-name: dialogOverlayFadeIn;
}

[data-animation='dialog'][data-state='closed'] {
  animation-name: dialogOverlayFadeOut;
}

[role='dialog'][data-animation='dialog'][data-state='open'] {
  animation-name: dialogContentFadeIn;
  animation-duration: 300ms;
}

[role='dialog'][data-animation='dialog'][data-state='closed'] {
  animation-name: dialogContentFadeOut;
}

@media (prefers-reduced-motion: reduce) {
  [data-animation='dialog'] {
    animation-duration: 0ms;
  }
}
</style>
