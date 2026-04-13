import type { KeyboardShortcutProps } from '@/components/keyboard-shortcut/keyboardShortcut.props'

export type VcKeyboardShortcutProps = Omit<KeyboardShortcutProps, 'classConfig' | 'variant'>
export { createKeyboardShortcutStyle } from '@/components/keyboard-shortcut/keyboardShortcut.style'
export { default as VcKeyboardShortcut } from '@/components/keyboard-shortcut/KeyboardShortcut.vue'
