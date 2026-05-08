import type {
  HotkeySequence,
  IndividualKey,
  RawHotkey,
} from '@tanstack/vue-hotkeys'

export type KeyboardShortcut = RawHotkey | { sequence: HotkeySequence }

export interface KeyboardShortcutKeyPart {
  part: 'key'
  rawKey: IndividualKey
  value: string
}

export interface KeyboardShortcutSequenceSeparatorPart {
  part: 'separator'
}

export type KeyboardShortcutPart = KeyboardShortcutKeyPart | KeyboardShortcutSequenceSeparatorPart
