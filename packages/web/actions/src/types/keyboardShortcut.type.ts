import type {
  HotkeySequence,
  RawHotkey,
} from '@tanstack/vue-hotkeys'

/**
 * A multi-step key sequence shortcut (e.g. ['g', 's'] — press g then s).
 * Maps to TanStack's HotkeySequence.
 */
export interface SequenceShortcut {
  /**
   * When true the shortcut fires even when a text input has focus.
   * Default: false — shortcuts are suppressed while typing.
   */
  runWithInputFocus?: boolean
  sequence: HotkeySequence
}

/**
 * A single-key shortcut (e.g. Mod+S).
 * Maps directly to TanStack's RawHotkey plus the `runWithInputFocus` flag.
 */
export type SingleKeyShortcut = RawHotkey & {
  /**
   * When true the shortcut fires even when a text input has focus.
   * Default: false — shortcuts are suppressed while typing.
   */
  runWithInputFocus?: boolean
  sequence?: never
}

export type KeyboardShortcut = SequenceShortcut | SingleKeyShortcut
