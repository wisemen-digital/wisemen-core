import { CustomViewColor } from '@/types/customViewColor.type'

export const CUSTOM_VIEW_COLORS_MAP = new Map<CustomViewColor, string>([
  [
    CustomViewColor.DEFAULT,
    'var(--fg-secondary)',
  ],
  [
    CustomViewColor.PURPLE,
    'oklch(0.44 0.17 287)',
  ],
  [
    CustomViewColor.CYAN,
    'oklch(0.71 0.12 213)',
  ],
  [
    CustomViewColor.GREEN,
    'oklch(0.70 0.13 159)',
  ],
  [
    CustomViewColor.YELLOW,
    'oklch(0.82 0.18 91)',
  ],
  [
    CustomViewColor.PINK,
    'oklch(0.87 0.05 22)',
  ],
  [
    CustomViewColor.RED,
    'oklch(0.58 0.19 25)',
  ],
])

export function getCustomViewColor(key: CustomViewColor): string {
  return CUSTOM_VIEW_COLORS_MAP.get(key) ?? 'var(--fg-secondary)'
}
