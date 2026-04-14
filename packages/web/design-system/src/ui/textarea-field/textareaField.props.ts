import type { DisabledWithReason } from '@/types/disabledWithReason.type'
import type {
  AutocompleteInput,
  Input,
  InputWrapper,
} from '@/types/input.type'

export interface TextareaFieldProps extends DisabledWithReason, Input, AutocompleteInput, InputWrapper {
  /**
   * Whether the input is spell check enabled.
   * @default false
   */
  isSpellCheckEnabled?: boolean
  /**
   * The maximum height of the textarea (e.g. `'200px'`, `'10rem'`).
   * @default null
   */
  maxHeight?: string | null
  /**
   * The maximum number of characters allowed. When set, a character count
   * is shown in place of the hint.
   * @default null
   */
  maxLength?: number | null
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
   * - `'auto-vertical'`: The textarea will resize vertically depending on the content height.
   * - `'none'`: The textarea cannot be resized.
   * - `'vertical'`: The textarea can be resized vertically, but not horizontally.
   * @default 'none'
   */
  resize?: 'auto-vertical' | 'none' | 'vertical'
}
