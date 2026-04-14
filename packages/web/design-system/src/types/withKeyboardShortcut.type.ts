import type { KeyboardKey } from '@/types/keyboardkey.type'

export interface WithKeyboardShortcut {
  keyboardShortcutKeys?: KeyboardKey[] | null
}
