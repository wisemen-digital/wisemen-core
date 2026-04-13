import type { KeyboardKey } from '@/types/keyboard.type'

/**
 * Props for the KeyboardShortcutProvider component.
 */
export interface KeyboardShortcutProviderProps {
  /**
   * Determines if the keyboard shortcut should be disabled.
   * @default false
   */
  isDisabled?: boolean
  /**
   * An array of keyboard keys that trigger the shortcut.
   */
  keyboardKeys: KeyboardKey[]
  /**
   * Whether to prevent the default browser behavior for the keyboard event.
   * @default false
   */
  preventDefault?: boolean
  /**
   * Whether to stop the event from propagating to other event listeners.
   * @default false
   */
  stopPropagation?: boolean
}
