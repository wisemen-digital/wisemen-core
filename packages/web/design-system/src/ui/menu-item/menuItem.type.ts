import type { Component } from 'vue'

import type { DotColor } from '@/ui/dot/dot.props'
import type { KeyboardShortcut } from '@/ui/keyboard-shortcut/keyboardShortcut.type'

export type MenuItemRightConfig
  = | {
    icon: Component
    text: string
    type: 'icon-text'
  }
  | {
    icon: Component
    type: 'icon'
  }
  | {
    keyboardShortcut: KeyboardShortcut
    type: 'shortcut'
  }
  | {
    text: string
    type: 'text'
  }

export interface MenuItemAvatarConfig {
  /**
   * The name used to generate fallback initials.
   */
  name: string
  /**
   * The alt text for the avatar image.
   */
  imageAlt?: string | null
  /**
   * The image source URL.
   */
  src?: string | null
}

export interface MenuItemDotConfig {
  /**
   * The color of the dot.
   * @default 'gray'
   */
  color?: DotColor
}

export interface MenuItemConfig {
  /**
   * Avatar displayed to the left of the label. Cannot be used together with `icon` or `dot`.
   */
  avatar?: MenuItemAvatarConfig | null
  /**
   * Secondary line of text shown below the label.
   */
  description?: string | null
  /**
   * Controls how the description is laid out relative to the label.
   * - `'block'` (default): description appears on its own line below the label.
   * - `'inline'`: description appears on the same line as the label, truncating when space is tight.
   * @default 'block'
   */
  descriptionLayout?: 'block' | 'inline'
  /**
   * Small colored dot displayed to the left of the label. Cannot be used together with `icon` or `avatar`.
   */
  dot?: MenuItemDotConfig | null
  /**
   * Inline SVG flag rendered as the left icon. Used by UIPhoneNumberField.
   * Takes precedence over `icon`.
   */
  flag?: {
    ariaLabel?: string | null

    svg: string
  } | null
  /**
   * Icon displayed to the left of the label. Cannot be used together with `avatar` or `dot`.
   */
  icon?: Component | null
  /**
   * Override the label shown in the item.
   */
  label?: string | null
  /**
   * Trailing content displayed to the right of the label, left of the right slot.
   * Supports: plain text, icon with text, keyboard shortcut, or a single icon.
   */
  right?: MenuItemRightConfig | null
}
