import type {
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface TagsFieldProps extends Input, InputWrapper, FieldWrapper {
  /**
   * The size of the tags field.
   * @default 'md'
   */
  size?: 'md' | 'sm'
  /**
   * Whether to add tags when pasting.
   * @default true
   */
  addOnPaste?: boolean
  /**
   * Whether duplicate tags are allowed.
   * @default false
   */
  allowDuplicate?: boolean
  /**
   * The delimiter used to split pasted text into tags.
   * @default ','
   */
  delimiter?: string
  /**
   * The maximum number of tags allowed. null means unlimited.
   * @default null
   */
  max?: number | null
}
