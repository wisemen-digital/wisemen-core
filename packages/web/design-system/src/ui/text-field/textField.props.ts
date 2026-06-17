import type { MaskInputOptions } from 'maska'

import type {
  AutocompleteInput,
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface TextFieldProps extends Input, AutocompleteInput, InputWrapper, FieldWrapper {
  /**
   * Optional v-maska configuration for input masking.
   */
  mask?: string | MaskInputOptions
  /**
   * The size of the text field.
   * @default 'md'
   */
  size?: 'md' | 'sm'
  /**
   * The type of the input.
   * @default 'text'
   */
  type?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url'
}
