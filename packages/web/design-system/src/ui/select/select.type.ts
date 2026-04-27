import type { Component } from 'vue'

export type SelectValue = number | string | Record<string, any> | null

export type SelectOptionRightConfig
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
    keys: string[]
    type: 'shortcut'
  }
  | {
    text: string
    type: 'text'
  }

export interface SelectOptionAvatarConfig {
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

export interface SelectOptionConfig {
  /**
   * Avatar displayed to the left of the label. Cannot be used together with `icon`.
   */
  avatar?: SelectOptionAvatarConfig | null
  /**
   * Secondary line of text shown below the label.
   */
  description?: string | null
  /**
   * Icon displayed to the left of the label. Cannot be used together with `avatar`.
   */
  icon?: Component | null
  /**
   * Override the label shown in the dropdown (falls back to displayFn).
   */
  label?: string | null
  /**
   * Trailing content displayed to the right of the label, left of the selection indicator.
   * Supports: plain text, icon with text, keyboard shortcut, or a single icon.
   */
  right?: SelectOptionRightConfig | null
}

export interface SelectOptionItem<SelectValue> {
  type: 'option'
  value: SelectValue
}
export interface SelectSeparatorItem {
  type: 'separator'
}

export type SelectItem<TValue extends SelectValue> = SelectOptionItem<TValue> | SelectSeparatorItem

export function createSelectOptions<TValue extends NonNullable<SelectValue>>(
  options: TValue[],
): SelectItem<TValue>[] {
  return options.map((option) => ({
    type: 'option',
    value: option,
  }))
}
