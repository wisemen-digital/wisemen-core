import type { BadgeProps } from '@/ui/badge/badge.props'

export interface DetailListCollapseOptions {
  isCollapsible: boolean
  isOpenByDefault: boolean
  badge?: Omit<BadgeProps, 'size'> | null
}
