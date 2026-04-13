import type { KeyboardKeyProps } from '@/components/keyboard-key/keyboardKey.props'

export type VcKeyboardKeyProps = Omit<KeyboardKeyProps, 'classConfig' | 'variant'>
export { createKeyboardKeyStyle } from '@/components/keyboard-key/keyboardKey.style'
export { default as VcKeyboardKey } from '@/components/keyboard-key/KeyboardKey.vue'
