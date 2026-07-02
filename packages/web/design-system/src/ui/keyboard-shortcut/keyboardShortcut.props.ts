import type { KeyboardShortcut } from '@/ui/keyboard-shortcut/keyboardShortcut.type'

export interface KeyboardShortcutProps {
  isKeyHoldVisualizationEnabled?: boolean
  /**
   * @deprecated Use `isKeyHoldVisualizationEnabled` instead.
   */
  enableKeyHoldVisualization?: boolean

  keyboardShortcut: KeyboardShortcut
}
