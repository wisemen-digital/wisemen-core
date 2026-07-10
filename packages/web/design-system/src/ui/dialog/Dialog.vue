<script setup lang="ts">
import {
  DialogContent as RekaDialogContent,
  DialogOverlay as RekaDialogOverlay,
  DialogRoot as RekaDialogRoot,
} from 'reka-ui'
import {
  computed,
  ref,
  watch,
} from 'vue'

import { useOverlayStack } from '@/composables/overlayStack.composable'
import { useProvideDialogContext } from '@/ui/dialog/dialog.context'
import type { DialogProps } from '@/ui/dialog/dialog.props'
import type { CreateDialogStyle } from '@/ui/dialog/dialog.style'
import { createDialogStyle } from '@/ui/dialog/dialog.style'
import DialogChin from '@/ui/dialog/DialogChin.vue'
import DialogCloseButton from '@/ui/dialog/DialogCloseButton.vue'
import { useDialogScroll } from '@/ui/dialog/dialogScroll.composable'

const props = withDefaults(defineProps<DialogProps>(), {
  hasCloseButton: true,
  isClickOutsideDisabled: false,
  isEscDisabled: false,
  chin: null,
  size: 'md',
})

const emit = defineEmits<{
  'afterLeave': []
  'close': []
  'update:isOpen': [value: boolean]
}>()
const hasCloseButton = computed<boolean>(
  () => props.showCloseButton !== undefined ? props.showCloseButton : props.hasCloseButton,
)
const isClickOutsideDisabled = computed<boolean>(
  () => props.isClickOutsideDisabled || props.preventClickOutside === true,
)
const isEscDisabled = computed<boolean>(
  () => props.isEscDisabled || props.preventEsc === true,
)

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
  if (isEscDisabled.value) {
    event.preventDefault()
  }
}

function onPointerDownOutside(event: Event): void {
  if (isClickOutsideDisabled.value) {
    event.preventDefault()
  }
}

function onOpenChange(value: boolean): void {
  if (!value) {
    emit('close')
  }
}

function onInteractOutside(event: CustomEvent): void {
  if (!(event.target instanceof Element)) {
    return
  }

  if (!event.target.hasAttribute('data-dialog-overlay')) {
    event.preventDefault()
  }
}

const overlayStack = useOverlayStack()

const dialogZIndex = ref<number>(0)

watch(isOpen, (isOpenValue) => {
  if (isOpenValue) {
    dialogZIndex.value = overlayStack.registerOverlay()
  }
}, {
  immediate: true,
})
</script>

<template>
  <RekaDialogRoot
    v-model:open="isOpen"
    :modal="true"
    @update:open="onOpenChange"
  >
    <RekaDialogOverlay
      :class="style.overlay()"
      :style="{
        zIndex: dialogZIndex,
      }"
      data-animation="dialog"
      data-dialog-overlay
    />

    <RekaDialogContent
      :class="style.contentWrapper()"
      :style="{
        zIndex: dialogZIndex,
      }"
      data-animation="dialog"
      @escape-key-down="onEscapeKeyDown"
      @pointer-down-outside="onPointerDownOutside"
      @after-leave="emit('afterLeave')"
      @interact-outside="onInteractOutside"
    >
      <div :class="style.content()">
        <slot />
        <DialogCloseButton v-if="hasCloseButton" />
      </div>

      <DialogChin :chin="props.chin" />
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
    transform: translateY(3rem);
  }
}

@keyframes dialogContentFadeOut {
  to {
    opacity: 0;
    transform: translateY(3rem);
  }
}

[data-animation='dialog'] {
  animation-duration: 180ms;
  animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}

[data-animation='dialog'][data-state='open'] {
  animation-name: dialogOverlayFadeIn;
  animation-duration: 400ms;
}

[data-animation='dialog'][data-state='closed'] {
  animation-name: dialogOverlayFadeOut;
  animation-duration: 120ms;
}

[role='dialog'][data-animation='dialog'][data-state='open'] {
  animation-name: dialogContentFadeIn;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}

[role='dialog'][data-animation='dialog'][data-state='closed'] {
  animation-name: dialogContentFadeOut;
  animation-duration: 120ms;
  animation-timing-function: ease-in;
}

@media (prefers-reduced-motion: reduce) {
  [data-animation='dialog'] {
    animation-duration: 0ms;
  }
}

body.reduced-motion [data-animation='dialog'],
body.reduced-motion [data-animation='dialog'][data-state='open'],
body.reduced-motion [data-animation='dialog'][data-state='closed'],
body.reduced-motion [role='dialog'][data-animation='dialog'][data-state='open'],
body.reduced-motion [role='dialog'][data-animation='dialog'][data-state='closed'] {
  animation-duration: 0ms;
}
</style>
