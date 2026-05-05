import type {
  AutocompleteInput,
  FieldWrapper,
  InlineField,
  Input,
} from '@/types/input.type'

export interface InlineTextFieldProps extends Input, AutocompleteInput, FieldWrapper, InlineField {
  /**
   * The size of the text field.
   * @default 'md'
   */
  size?: 'md' | 'sm' | 'xs'
  /**
   * The type of the input.
   * @default 'text'
   */
  type?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url'
}
