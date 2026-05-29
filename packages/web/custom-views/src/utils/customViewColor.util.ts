import { CustomViewColor } from '@/types/customViewColor.type'

export const CUSTOM_VIEW_COLORS_MAP = new Map<CustomViewColor, string>([
  [CustomViewColor.DEFAULT, 'var(--fg-secondary)'],
  [CustomViewColor.PURPLE, 'lch(48 59.31 288.43)'],
  [CustomViewColor.CYAN, 'rgb(38, 181, 206)'],
  [CustomViewColor.GREEN, 'rgb(76, 183, 130)'],
  [CustomViewColor.YELLOW, 'lch(80 90 85)'],
  [CustomViewColor.PINK, 'rgb(247, 200, 193)'],
  [CustomViewColor.RED, 'rgb(235, 87, 87)'],
])

export function getCustomViewColor(key: CustomViewColor): string {
  return CUSTOM_VIEW_COLORS_MAP.get(key) ?? 'var(--fg-secondary)'
}
