import type { useFilters } from '@/composables'
import { useContext } from '@/composables/context.composable'

interface FiltersContext extends ReturnType<typeof useFilters<any>> {}

export const [
  useProvideFiltersContext,
  useInjectFiltersContext,
] = useContext<FiltersContext>('filtersContext')
