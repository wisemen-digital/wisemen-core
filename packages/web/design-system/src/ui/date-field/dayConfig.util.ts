import type { PlainDate } from '@wisemen/vue-core-dates'
import { Temporal } from 'temporal-polyfill'

import type { DayConfig } from '@/ui/date-field/dateField.type'
import { dotVariants } from '@/ui/dot/dot.style'

export function getDayIndicatorDotClass(
  date: {
    day: number
    month: number
    year: number
  },
  getDayConfig: ((date: PlainDate) => DayConfig | null) | undefined,
): string | null {
  if (getDayConfig == null) {
    return null
  }

  const plainDate = Temporal.PlainDate.from({
    day: date.day,
    month: date.month,
    year: date.year,
  })

  const config = getDayConfig(plainDate)

  if (config?.type !== 'dot') {
    return null
  }

  return dotVariants({
    color: config.color,
  })
}
