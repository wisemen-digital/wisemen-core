import { useContext } from '@/composables/context.composable'
import type { AddressAutocompleteAdapter } from '@/ui/address-autocomplete/addressAutocomplete.type'

export const [
  useProvideAddressAutocompleteAdapter,
  useInjectAddressAutocompleteAdapter,
] = useContext<AddressAutocompleteAdapter>('addressAutocompleteAdapter')
