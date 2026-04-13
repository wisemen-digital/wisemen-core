import type { AcceptableInputValue } from 'reka-ui'

import type {
  AutocompleteInput,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface BaseCheckboxProps extends Input, InputWrapper, AutocompleteInput {
  /**
   * Whether the checkbox is in an indeterminate state.
   * @default false
   */
  isIndeterminate?: boolean

  /**
   * The value of the checkbox.
   */
  value?: AcceptableInputValue

}
