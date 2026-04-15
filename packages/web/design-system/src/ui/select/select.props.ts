import type {
  AutocompleteInput,
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'
import type { PopoverProps } from '@/ui/popover/popover.props'
import type {
  SelectItem,
  SelectValue,
} from '@/ui/select/select.type'

export type GetValue<TValue> = TValue extends Array<infer U> ? U : TValue

export type DisplayFn<
  TValue extends SelectValue | SelectValue[],
> = (item: NonNullable<GetValue<TValue>>) => string

export interface SelectProps<TValue extends SelectValue | SelectValue[]>
  extends Input, AutocompleteInput, InputWrapper, FieldWrapper, PopoverProps {
  /**
   * Function to display the item label.
   */
  displayFn: DisplayFn<TValue>
  /**
   * The items to display in the select.
   */
  items: SelectItem<GetValue<TValue>>[]
  /**
   * Whether to keep the dropdown open after selecting an option.
   * @default null - will close on single select, stay open on multi select
   */
  keepDropdownOpenOnSelect?: boolean | null
  /**
   * Should only be set when the dropdown list if not paginated, but is limited in the backend
   * @default null
   */
  limit?: number | null
  /**
   * The search mode of the select.
   * - `local`: filtering is done on the client side
   * - `remote`: filtering is done on the server side. In this mode, you need to handle the filtering logic yourself.
   * - `null`: no search functionality
   * @default null
   */
  search?: 'local' | 'remote' | null
  /**
   * The size of the select.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}

export type SelectContentProps<TValue extends SelectValue | SelectValue[]> = Pick<
  SelectProps<TValue>,
  | 'displayFn'
  | 'isLoading'
  | 'items'
  | 'limit'
  | 'search'
>
