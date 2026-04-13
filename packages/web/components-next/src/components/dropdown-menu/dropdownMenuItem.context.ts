import type { DropdownMenuItemProps } from '@/components/dropdown-menu/dropdownMenu.props'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface DropdownMenuItemContext extends PropsToComputed<DropdownMenuItemProps> {}

export const [
  useProvideDropdownMenuItemContext,
  useInjectDropdownMenuItemContext,
] = useContext<DropdownMenuItemContext>('dropdownMenuItemContext')
