import type { Component } from 'vue'

import type {
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface SwitchProps extends Input, InputWrapper {
  /**
   * The icon to be displayed when the switch is checked.
   * @default null
   */
  iconChecked?: Component | null
  /**
   * The icon to be displayed when the switch is unchecked.
   * @default null
   */
  iconUnchecked?: Component | null
  /**
   * Defines the size of the switch.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
