import { useContext } from '@/composables/context.composable'
import type { BreadcrumbItemProps } from '@/ui/breadcrumbs/breadcrumb.props'

interface MainContentContext {
  setBreadcrumbs: (breadcrumbs: BreadcrumbItemProps[]) => void
}

export const [
  useProvideMainContentContext,
  useInjectMainContentContext,
] = useContext<MainContentContext>('mainContentContext')
