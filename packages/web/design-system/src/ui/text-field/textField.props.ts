import type {
  AutocompleteInput,
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface TextFieldProps extends Input, AutocompleteInput, InputWrapper, FieldWrapper {
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
