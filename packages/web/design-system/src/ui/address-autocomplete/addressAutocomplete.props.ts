import type { Address } from '@/ui/address-autocomplete/addressAutocomplete.type'
import type { AutocompleteProps } from '@/ui/autocomplete/autocomplete.props'

export interface AddressAutocompleteProps
  extends Omit<AutocompleteProps<Address | null>, 'displayFn' | 'getItemConfig' | 'items' | 'searchMode'> {}
