interface WeekInfo {
  firstDay: number
}

interface LocaleWithWeekInfo extends Intl.Locale {
  getWeekInfo: () => WeekInfo
}

const DEFAULT_WEEK_STARTS_ON: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1

/**
 * Returns the first day of the week for a given locale.
 * 0 = Sunday, 1 = Monday, ... 6 = Saturday (matches reka-ui's weekStartsOn convention).
 */
export function getWeekStartsOn(locale: string): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  try {
    if (typeof Intl === 'undefined' || typeof Intl.Locale === 'undefined') {
      return DEFAULT_WEEK_STARTS_ON
    }

    const localeWithWeekInfo = new Intl.Locale(locale) as LocaleWithWeekInfo

    if (typeof localeWithWeekInfo.getWeekInfo !== 'function') {
      return DEFAULT_WEEK_STARTS_ON
    }

    // getWeekInfo() uses ISO weekday numbers: 1 = Monday, 7 = Sunday
    const {
      firstDay,
    } = localeWithWeekInfo.getWeekInfo()

    if (firstDay < 1 || firstDay > 7) {
      return DEFAULT_WEEK_STARTS_ON
    }

    return (firstDay === 7 ? 0 : firstDay) as 0 | 1 | 2 | 3 | 4 | 5 | 6
  }
  catch {
    return DEFAULT_WEEK_STARTS_ON
  }
}
