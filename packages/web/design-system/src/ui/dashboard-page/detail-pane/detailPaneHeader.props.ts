import type { BaseHeaderLeftConfig } from '@/ui/base-header/baseHeader.type'

export interface DetailPaneHeaderProps {
  title: string
  left?: BaseHeaderLeftConfig | null
  showSeparator?: boolean
}
