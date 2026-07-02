<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { computed } from 'vue'

import { useKeyboardShortcut } from '@/composables/keyboardShortcut.composable'
import { UIButton } from '@/ui/button/index'
import { useInjectFormContext } from '@/ui/form/form.context'

const props = withDefaults(defineProps<{
  isKeyboardShortcutDisabled?: boolean
  /**
   * @deprecated Use `isKeyboardShortcutDisabled` instead.
   */
  disableKeyboardShortcut?: boolean
  label: string
  variant?: 'primary' | 'secondary'
}>(), {
  isKeyboardShortcutDisabled: false,
  variant: 'primary',
})

const isKeyboardShortcutDisabled = computed<boolean>(
  () => props.isKeyboardShortcutDisabled || props.disableKeyboardShortcut === true,
)

const KEYBOARD_SHORTCUTS = {
  submit: {
    keys: [
      'meta',
      'enter',
    ],
    shortcutKey: 'meta_enter',
  },
} as const

const {
  formId, form,
} = useInjectFormContext()

useKeyboardShortcut({
  [KEYBOARD_SHORTCUTS.submit.shortcutKey]: () => {
    if (isKeyboardShortcutDisabled.value) {
      return
    }

    form.submit()
  },
})
</script>

<template>
  <Primitive
    :as-child="true"
    v-bind="props"
    :is-loading="form.isSubmitting.value"
    :form="formId"
    type="submit"
  >
    <slot>
      <UIButton
        :label="props.label"
        :form="formId"
        :variant="props.variant"
        :keyboard-shortcut-keys="isKeyboardShortcutDisabled ? null : KEYBOARD_SHORTCUTS.submit.keys"
      />
    </slot>
  </Primitive>
</template>
