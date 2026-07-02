import type { KeyboardShortcut } from '@/ui/keyboard-shortcut/keyboardShortcut.type'

export interface KeyboardShortcutProps {
  isKeyHoldVisualizationEnabled?: boolean
  keyboardShortcut: KeyboardShortcut

  /**
   * @deprecated Use `isKeyHoldVisualizationEnabled` instead.
   */
  enableKeyHoldVisualization?: boolean
}
