<script setup lang="ts">
import { computed } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import {
  getCustomComponentVariant,
  mergeClasses,
} from '@/class-variant/customClassVariants'
import type { KeyboardKeyProps } from '@/components/keyboard-key/keyboardKey.props'
import type { CreatekeyboardKeyStyle } from '@/components/keyboard-key/keyboardKey.style'
import { createKeyboardKeyStyle } from '@/components/keyboard-key/keyboardKey.style'
import { injectThemeProviderContext } from '@/components/theme-provider/themeProvider.context'
import type { KeyboardKey } from '@/types/keyboard.type'

const props = withDefaults(defineProps<KeyboardKeyProps>(), {
  classConfig: null,
  variant: null,
})

const WINDOWS_REGEX = /windows/i

const {
  theme,
} = injectThemeProviderContext()

const isWindows = computed<boolean>(() => (
  WINDOWS_REGEX.test(navigator.userAgent)
))

const macKeyMap = new Map<KeyboardKey, string>([
  [
    'alt',
    '⌥',
  ],
  [
    'arrowdown',
    '↓',
  ],
  [
    'arrowleft',
    '←',
  ],
  [
    'arrowright',
    '→',
  ],
  [
    'arrowup',
    '↑',
  ],
  [
    'backspace',
    '⌫',
  ],
  [
    'ctrl',
    '⌃',
  ],
  [
    'enter',
    '↵',
  ],
  [
    'escape',
    'ESC',
  ],
  [
    'meta',
    '⌘',
  ], // Command key on Mac
  [
    'shift',
    '⇧',
  ],
])

const windowsKeyMap = new Map<KeyboardKey, string>([
  [
    'alt',
    'Alt',
  ],
  [
    'arrowdown',
    '↓',
  ],
  [
    'arrowleft',
    '←',
  ],
  [
    'arrowright',
    '→',
  ],
  [
    'arrowup',
    '↑',
  ],
  [
    'backspace',
    'Backspace',
  ],
  [
    'ctrl',
    'Ctrl',
  ],
  [
    'enter',
    'Enter',
  ],
  [
    'escape',
    'Esc',
  ],
  [
    'meta',
    'Win',
  ], // Windows key
  [
    'shift',
    'Shift',
  ],
])

const keyboardKeyStyle = computed<CreatekeyboardKeyStyle>(
  () => createKeyboardKeyStyle({
    variant: props.variant ?? undefined,
  }),
)

const customClassConfig = computed<ResolvedClassConfig<'keyboardKey'>>(
  () => getCustomComponentVariant('keyboardKey', theme.value, {
    variant: props.variant,
  }),
)

const keyboardKey = computed<string>(() => {
  const map = isWindows.value ? windowsKeyMap : macKeyMap

  return map.get(props.keyboardKey) ?? props.keyboardKey
})
</script>

<template>
  <kbd
    :class="keyboardKeyStyle.key({
      class: mergeClasses(customClassConfig.key, props.classConfig?.key),
    })"
  >
    {{ keyboardKey }}
  </kbd>
</template>
