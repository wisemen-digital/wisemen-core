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

export interface MenuItemBreadcrumb {
  icon?: Component
  label: string
}

export type MenuItemLeftConfig
  = {
    /**
     * Breadcrumb path showing the item's context.
     * Each entry is rendered with an optional icon and label, separated by chevrons.
     */
    breadcrumbs: MenuItemBreadcrumb[]
    type: 'breadcrumbs'
  }
  | {
    /**
     * Controls the aspect ratio of the image.
     * - `'square'` — equal width and height (default)
     * - `'rectangle'` — wider than tall, suited for landscape thumbnails
     */
    aspect?: 'rectangle' | 'square'
    /**
     * The URL or data URI of the image to display.
     */
    src: string
    type: 'image'
  }
  | {
    /**
     * The color of the dot.
     * @default 'gray'
     */
    color?: DotColor
    type: 'dot'
  }
  | {
    /**
     * The icon component to display.
     */
    icon: Component
    type: 'icon'
  }
  | {
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
    type: 'avatar'
  }

export interface MenuItemConfig {
  /**
   * Secondary line of text shown below the label.
   * - `layout: 'block'` (default): description appears on its own line below the label.
   * - `layout: 'inline'`: description appears on the same line as the label, truncating when space is tight.
   */
  description?: {
    layout: 'block' | 'inline'
    value: string
  } | null
  /**
   * Content displayed to the left of the label.
   * Supports avatar, dot, icon, image, or breadcrumbs. Each type is mutually exclusive.
   */
  left?: MenuItemLeftConfig | null
  /**
   * Trailing content displayed to the right of the label, left of the right slot.
   * Supports: plain text, icon with text, keyboard shortcut, or a single icon.
   */
  right?: MenuItemRightConfig | null
}
