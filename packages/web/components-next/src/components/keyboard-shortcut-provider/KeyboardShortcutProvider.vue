<script setup lang="ts">
import {
  computed,
  ref,
} from 'vue'

import type { KeyboardShortcutProviderProps } from '@/components/keyboard-shortcut-provider/keyboardShortcutProvider.props'
import { useKeyboardShortcut } from '@/composables/keyboardShortcut.composable'

const props = withDefaults(defineProps<KeyboardShortcutProviderProps>(), {
  isDisabled: false,
  preventDefault: false,
  stopPropagation: false,
})

const wrapperRef = ref<HTMLElement | null>(null)

function isTabbable(element: Element): boolean {
  const tabbableTags = [
    'A',
    'BUTTON',
    'INPUT',
    'TEXTAREA',
    'SELECT',
    'DETAILS',
  ]

  if (tabbableTags.includes(element.tagName)) {
    const el = element as HTMLElement

    return !el.hasAttribute('disabled') && el.tabIndex >= 0 && !el.hidden
  }

  const el = element as HTMLElement

  return el.tabIndex >= 0 && !el.hidden
}

function getFirstInteractiveDescendant(root: HTMLElement): HTMLElement | null {
  const tabbableSelector = 'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"]), [contenteditable]'

  const allTabbableElements = Array.from(root.querySelectorAll(tabbableSelector))

  for (const element of allTabbableElements) {
    if (isTabbable(element)) {
      return element as HTMLElement
    }
  }

  return null
}

function parentHasAriaHidden(element: HTMLElement): boolean {
  let parent = element.parentElement

  while (parent) {
    if (parent.hasAttribute('aria-hidden')) {
      return parent.getAttribute('aria-hidden') === 'true'
    }

    parent = parent.parentElement
  }

  return false
}

useKeyboardShortcut({
  isDisabled: computed<boolean>(() => props.isDisabled),
  keys: props.keyboardKeys,
  onTrigger: (event) => {
    if (wrapperRef.value === null) {
      return
    }

    const firstInteractiveElement = getFirstInteractiveDescendant(wrapperRef.value)

    if (firstInteractiveElement === null) {
      return
    }

    if (props.preventDefault ?? false) {
      event.preventDefault()
    }

    if (props.stopPropagation ?? false) {
      event.stopPropagation()
    }

    const isAriaHidden = parentHasAriaHidden(firstInteractiveElement)

    if (isAriaHidden) {
      return
    }

    const isInput = firstInteractiveElement.tagName === 'INPUT' || firstInteractiveElement.tagName === 'TEXTAREA'

    if (isInput) {
      firstInteractiveElement.focus()
    }
    else {
      firstInteractiveElement.click()
    }
  },
})
</script>

<template>
  <div ref="wrapperRef">
    <slot :keys="props.keyboardKeys" />
  </div>
</template>
