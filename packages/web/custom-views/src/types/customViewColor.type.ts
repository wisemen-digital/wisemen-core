export const CUSTOM_VIEW_COLOR = {
  CYAN: 'cyan',
  DEFAULT: 'default',
  GREEN: 'green',
  PINK: 'pink',
  PURPLE: 'purple',
  RED: 'red',
  YELLOW: 'yellow',
} as const

export type CustomViewColor = (typeof CUSTOM_VIEW_COLOR)[keyof typeof CUSTOM_VIEW_COLOR]
