import type { MainSidebarCollapsedVariant } from '@/ui/sidebar/types/mainSidebar.type'

export interface MainSidebarProps {
  /**
   * Controls the visual layout variant of the sidebar when collapsed.
   * @default 'hidden'
   */
  collapsedVariant?: MainSidebarCollapsedVariant
}
