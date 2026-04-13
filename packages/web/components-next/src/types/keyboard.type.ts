import type { Ref } from 'vue'

export type KeyboardKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | ' ' | ',' | '.' | ';' | '<' | '>' | 'a' | 'alt' | 'arrowdown' | 'arrowleft' | 'arrowright' | 'arrowup' | 'b' | 'backspace' | 'c' | 'ctrl' | 'd' | 'delete' | 'e' | 'enter' | 'escape' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'meta' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 'shift' | 't' | 'tab' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'

export interface KeyboardShortcut {
  /**
   * Whether the keyboard shortcut is disabled
   * @default false
   */
  isDisabled?: Ref<boolean>
  /**
   * The element to bind the keyboard shortcut to
   * @default document
   */
  element?: HTMLElement
  /**
   * The keys to trigger the shortcut
   * @example ['ctrl', 'shift', 'a'] will trigger on ctrl + shift + a in combination mode
   * @example ['a', 'b', 'c'] will trigger in sequence mode
   */
  keys: KeyboardKey[]
}

export interface KeyboardShortcutConfig {
  isDisabled?: Ref<boolean>
  keys: KeyboardKey[]
  preventDefault?: boolean
  stopPropagation?: boolean
}
