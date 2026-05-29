export const CustomViewColor = {
  DEFAULT: 'default',
  PURPLE: 'purple',
  CYAN: 'cyan',
  GREEN: 'green',
  YELLOW: 'yellow',
  PINK: 'pink',
  RED: 'red',
} as const

export type CustomViewColor = (typeof CustomViewColor)[keyof typeof CustomViewColor]
