import type {
  AutocompleteInput,
  FieldWrapper,
  Input,
  InputWrapper,
} from '@/types/input.type'
import type {
  AutocompleteItem,
  AutocompleteValue,
} from '@/ui/autocomplete/autocomplete.type'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'
import type { PopoverProps } from '@/ui/popover/popover.props'

export type AutocompleteDisplayFn<TValue extends AutocompleteValue> = (
  item: NonNullable<TValue>,
) => string

export interface AutocompleteProps<TValue extends AutocompleteValue>
  extends Input, AutocompleteInput, InputWrapper, FieldWrapper, PopoverProps {
  /**
   * Function to display the item label.
   */
  displayFn: AutocompleteDisplayFn<TValue>
  /**
   * Maps a value to its visual config (avatar, icon, status, etc.).
   * Used in each dropdown option.
   * @default null
   */
  getItemConfig?: ((value: NonNullable<TValue>) => MenuItemConfig | null) | null
  /**
   * The items to display in the autocomplete dropdown.
   */
  items: AutocompleteItem<TValue>[]
  /**
   * Whether to open the dropdown when the input is clicked.
   * @default true
   */
  openOnClick?: boolean
  /**
   * The search mode of the autocomplete.
   * - `local`: filtering is done on the client side
   * - `remote`: filtering is done on the server side. Handle the `update:search` event to fetch results.
   * @default 'local'
   */
  search?: 'local' | 'remote'
  /**
   * The size of the autocomplete.
   * @default 'md'
   */
  size?: 'md' | 'sm'
}

export type AutocompleteContentProps<TValue extends AutocompleteValue> = Pick<
  AutocompleteProps<TValue>,
  | 'displayFn'
  | 'isLoading'
  | 'items'
  | 'search'
>
