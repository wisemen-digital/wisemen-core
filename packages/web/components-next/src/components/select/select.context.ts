import type {
  ComputedRef,
  Ref,
} from 'vue'

import type { ResolvedClassConfig } from '@/class-variant/classVariant.type'
import type {
  SelectProps,
  SelectValue,
} from '@/components/select/select.props'
import type { CreateSelectStyle } from '@/components/select/style/select.style'
import { useContext } from '@/composables/context/context.composable'
import type { PropsToComputed } from '@/utils/props.util'

interface SelectContext extends PropsToComputed<SelectProps<any>> {
  hasInlineSearchInput: ComputedRef<boolean>
  hasInteractedWithInlineSearchInput: Ref<boolean>
  hasScrolledInDropdownContent: Ref<boolean>
  isDropdownVisible: ComputedRef<boolean>
  isMultiple: ComputedRef<boolean>
  allGroups: Ref<Map<string, Set<string>>>
  allItems: Ref<Map<string, unknown>>
  customClassConfig: ComputedRef<ResolvedClassConfig<'select'>>
  filteredGroups: ComputedRef<Map<string, Set<string>>>
  filteredItems: ComputedRef<Map<string, unknown>>
  inlinesearchInputElementRef: Ref<HTMLInputElement | null>
  modelValue: Ref<SelectValue>
  searchTerm: Ref<string>
  setIsDropdownVisible: (value: boolean) => void
  style: ComputedRef<CreateSelectStyle>
  virtualListFilteredItems: ComputedRef<unknown[]>
  onDropdownEscapeKeyDown: () => void
  onDropdownInteractOutside: (event: CustomEvent) => void
  onSelectItem: () => void
}

export const [
  useProvideSelectContext,
  useInjectSelectContext,
] = useContext<SelectContext>('selectContext')
