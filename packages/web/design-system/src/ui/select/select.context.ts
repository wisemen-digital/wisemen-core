import type { ComputedRef } from 'vue'

import { useContext } from '@/composables/context.composable'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'
import type { SelectProps } from '@/ui/select/select.props'

interface SelectContext {
  getItemConfig: ((value: any) => MenuItemConfig | null) | null
  size: ComputedRef<SelectProps<any>['size']>
  onSelectOption: () => void
}

export const [
  useProvideSelectContext,
  useInjectSelectContext,
] = useContext<SelectContext>('selectContext')
