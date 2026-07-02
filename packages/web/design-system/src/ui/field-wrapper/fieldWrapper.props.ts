import type { FieldWrapper } from '@/types/input.type'
import type { LayoutGap } from '@/ui/column-layout/columnLayout.props'

export interface FieldWrapperProps extends FieldWrapper {
  /**
   * Whether the input is in an error state.
   * @default false
   */
  isError?: boolean
  /**
   * When true, the wrapper uses min-height instead of a fixed height and allows
   * its children to wrap onto multiple lines (e.g. for tags inputs).
   * @default false
   */
  isWrapped?: boolean
  /**
   * Controls the spacing between items inside the wrapper.
   * @default 'none'
   */
  gap?: LayoutGap
  /**
   * The size of the input field.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}
