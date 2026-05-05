import type {
  AutocompleteInput,
  InlineField,
  Input,
} from '@/types/input.type'

export interface InlineTextareaFieldProps extends Input, AutocompleteInput, InlineField {
  /**
   * Whether the textarea is spell check enabled.
   * @default false
   */
  isSpellCheckEnabled?: boolean
  /**
   * The maximum height of the textarea (e.g. `'200px'`, `'10rem'`).
   * @default null
   */
  maxHeight?: string | null
  /**
   * The minimum height of the textarea (e.g. `'100px'`, `'5rem'`).
   * @default null
   */
  minHeight?: string | null
  /**
   * The placeholder text of the textarea.
   * @default null
   */
  placeholder?: string | null
  /**
   * Whether the textarea can be resized.
   * @default 'none'
   */
  resize?: 'auto-vertical' | 'none' | 'vertical'
  /**
   * The size of the textarea.
   * @default 'md'
   */
  size?: 'md' | 'sm' | 'xs'
}
