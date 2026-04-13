import type {
  CustomizableElement,
  GetComponentProp,
} from '@/class-variant/classVariant.type'
import type { KeyboardKey } from '@/types/keyboard.type'

export interface KeyboardShortcutProps extends CustomizableElement<'keyboardShortcut'> {
  /**
   * A list of keyboard keys that represent the shortcut combination.
   */
  keyboardKeys: KeyboardKey[]
  /**
   * Defines the visual style of the keyboard shortcut.
   */
  variant?: GetComponentProp<'keyboardShortcut', 'variant'> | null
}
