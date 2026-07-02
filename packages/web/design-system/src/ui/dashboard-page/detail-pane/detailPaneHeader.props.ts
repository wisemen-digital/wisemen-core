import type { BaseHeaderLeftConfig } from '@/ui/base-header/baseHeader.type'

export interface DetailPaneHeaderProps {
  title: string
  hasSeparator?: boolean
  left?: BaseHeaderLeftConfig | null

  /**
   * @deprecated Use `hasSeparator` instead.
   */
  showSeparator?: boolean
}
