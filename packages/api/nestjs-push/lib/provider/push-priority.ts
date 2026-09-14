/** Stable domain priorities mapped by transport adapters. */
export const PushPriority = {
  LOW: 1,
  MEDIUM: 5,
  HIGH: 10
} as const

export type PushPriorityValue = typeof PushPriority[keyof typeof PushPriority]
