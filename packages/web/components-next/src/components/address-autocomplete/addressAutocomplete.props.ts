import type { Address } from '@/components/address-autocomplete/addressAutocomplete.type'
import type { AutocompleteProps } from '@/components/autocomplete/autocomplete.props'

export interface AddressAutocompleteProps extends Omit<AutocompleteProps<Address | null>, 'displayFn' | 'filter' | 'items'> {}
