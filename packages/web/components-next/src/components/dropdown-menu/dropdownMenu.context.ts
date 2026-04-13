import type { ComputedRef } from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type { DropdownMenuProps } from '@/components/dropdown-menu/dropdownMenu.props'
import type { CreateDropdownMenuStyle } from '@/components/dropdown-menu/dropdownMenu.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface DropdownMenuContext extends PropsToComputed<DropdownMenuProps> {
  isOpen: ComputedRef<boolean>
  customClassConfig: ComputedRef<ResolvedClassConfig<'dropdownMenu'>>
  style: ComputedRef<CreateDropdownMenuStyle>
  onCloseAutoFocus: (event: Event) => void
  onEscapeKeyDown: (event: KeyboardEvent) => void
}

export const [
  useProvideDropdownMenuContext,
  useInjectDropdownMenuContext,
] = useContext<DropdownMenuContext>('dropdownMenuContext')
