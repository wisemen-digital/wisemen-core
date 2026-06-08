import type { CustomViewColor } from '@/types/customViewColor.type'
import { CUSTOM_VIEW_COLOR } from '@/types/customViewColor.type'

export const CUSTOM_VIEW_COLORS_MAP = new Map<CustomViewColor, string>([
  [
    CUSTOM_VIEW_COLOR.DEFAULT,
    'var(--fg-secondary)',
  ],
  [
    CUSTOM_VIEW_COLOR.PURPLE,
    'oklch(0.44 0.17 287)',
  ],
  [
    CUSTOM_VIEW_COLOR.CYAN,
    'oklch(0.71 0.12 213)',
  ],
  [
    CUSTOM_VIEW_COLOR.GREEN,
    'oklch(0.70 0.13 159)',
  ],
  [
    CUSTOM_VIEW_COLOR.YELLOW,
    'oklch(0.82 0.18 91)',
  ],
  [
    CUSTOM_VIEW_COLOR.PINK,
    'oklch(0.87 0.05 22)',
  ],
  [
    CUSTOM_VIEW_COLOR.RED,
    'oklch(0.58 0.19 25)',
  ],
])

export function getCustomViewColor(key: CustomViewColor): string {
  return CUSTOM_VIEW_COLORS_MAP.get(key) ?? 'var(--fg-secondary)'
}
