import type { Ref } from 'vue'
import { ref } from 'vue'

import type { PageBreadcrumb } from '@/ui/dashboard-page/dashboardPage.type'

const title = ref<string | null>(null)
const breadcrumbs = ref<PageBreadcrumb[]>([])

interface UseTopBarNavigationReturn {
  title: Ref<string | null>
  breadcrumbs: Ref<PageBreadcrumb[]>
  clearNavigation: () => void
  setNavigation: (titleValue: string, breadcrumbsValue: PageBreadcrumb[]) => void
}

export function useTopBarNavigation(): UseTopBarNavigationReturn {
  function setNavigation(
    titleValue: string,
    breadcrumbsValue: PageBreadcrumb[],
  ): void {
    title.value = titleValue
    breadcrumbs.value = breadcrumbsValue
  }

  function clearNavigation(): void {
    title.value = null
    breadcrumbs.value = []
  }

  return {
    title,
    breadcrumbs,
    clearNavigation,
    setNavigation,
  }
}
