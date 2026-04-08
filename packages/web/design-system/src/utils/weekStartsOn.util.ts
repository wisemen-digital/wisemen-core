interface WeekInfo {
  firstDay: number
}

interface LocaleWithWeekInfo extends Intl.Locale {
  getWeekInfo: () => WeekInfo
}

/**
 * Returns the first day of the week for a given locale.
 * 0 = Sunday, 1 = Monday, ... 6 = Saturday (matches reka-ui's weekStartsOn convention).
 */
export function getWeekStartsOn(locale: string): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  // getWeekInfo() uses ISO weekday numbers: 1 = Monday, 7 = Sunday
  const {
    firstDay,
  } = (new Intl.Locale(locale) as LocaleWithWeekInfo).getWeekInfo()

  return (firstDay === 7 ? 0 : firstDay) as 0 | 1 | 2 | 3 | 4 | 5 | 6
}
