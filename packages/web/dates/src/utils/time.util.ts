import type { HourCycle } from '#models/hourCycle.model.ts'
import type { Locale } from '#models/locale.model.ts'
import type { TimeZone } from '#models/timeZone.model.ts'
import { LocaleUtil } from '#utils/locale.util.ts'

export class TimeUtil {
  static getDefaultHourCycleForLocale(locale: Locale): HourCycle {
    const formatter = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
    })

    const {
      hourCycle,
    } = formatter.resolvedOptions()

    return hourCycle === 'h11' || hourCycle === 'h12' ? '12-hour' : '24-hour'
  }

  static getTimeFormatOptions(
    hourCycle: HourCycle,
    timeZone: TimeZone,
    withSeconds: boolean,
  ): Intl.DateTimeFormatOptions {
    return {
      hour: '2-digit',
      hourCycle: (function (): 'h12' | 'h23' | undefined {
        switch (hourCycle) {
          case '12-hour':
            return 'h12'
          case '24-hour':
            return 'h23'
          case 'locale-default':
            return TimeUtil.getDefaultHourCycleForLocale(LocaleUtil.getCurrentLocale()) === '12-hour' ? 'h12' : 'h23'
        }
      }()),
      minute: '2-digit',
      second: withSeconds ? '2-digit' : undefined,
      timeZone,
    }
  }
}
