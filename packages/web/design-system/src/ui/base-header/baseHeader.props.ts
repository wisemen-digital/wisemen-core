import type { BaseHeaderLeftConfig } from '@/ui/base-header/baseHeader.type'

export interface BaseHeaderProps {
  /**
   * The primary heading text. Rendered as an h1 element.
   */
  title: string
  /**
   * Optional leading visual displayed to the left of the title.
   * Supports icon, featured-icon, avatar, dot, logo, or image variants.
   * @default null
   */
  left?: BaseHeaderLeftConfig | null
}
