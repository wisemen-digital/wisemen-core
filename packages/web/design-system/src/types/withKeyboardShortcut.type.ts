import type { KeyboardShortcut } from '@/ui/keyboard-shortcut/keyboardShortcut.type'

export interface WithKeyboardShortcut {
  /**
   * Keyboard shortcut to display alongside this item.
   *
   * @remarks
   * This is purely decorative — it renders the shortcut visually but does not
   * register any key listeners or trigger any behaviour. Handling the actual
   * shortcut must be done separately.
   *
   * @default null
   */
  keyboardShortcut?: KeyboardShortcut | null
}
