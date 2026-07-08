import type {
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface TagsFieldProps extends Input, InputWrapper, FieldWrapper {
  /**
   * Whether to add a tag when the input loses focus.
   * @default false
   */
  isAddedOnBlur?: boolean
  /**
   * Whether to add tags when pasting.
   * @default true
   */
  isAddedOnPaste?: boolean
  /**
   * Whether to add a tag when the Tab key is pressed.
   * @default false
   */
  isAddedOnTab?: boolean
  /**
   * Whether duplicate tags are allowed.
   * @default false
   */
  isDuplicateAllowed?: boolean
  /**
   * @deprecated Use `isAddedOnBlur` instead.
   */
  addOnBlur?: boolean
  /**
   * @deprecated Use `isAddedOnPaste` instead.
   */
  addOnPaste?: boolean
  /**
   * @deprecated Use `isAddedOnTab` instead.
   */
  addOnTab?: boolean
  /**
   * @deprecated Use `isDuplicateAllowed` instead.
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
  /**
   * The size of the tags field.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
