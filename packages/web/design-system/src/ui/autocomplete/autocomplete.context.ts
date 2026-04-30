import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { AutocompleteProps } from '@/ui/autocomplete/autocomplete.props'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'

interface AutocompleteContext {
  getItemConfig: ((value: any) => MenuItemConfig | null) | null
  size: ComputedRef<AutocompleteProps<any>['size']>
}

export const [
  useProvideAutocompleteContext,
  useInjectAutocompleteContext,
] = useContext<AutocompleteContext>('autocompleteContext')
