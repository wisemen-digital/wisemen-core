import type { TimeZone } from '#models/timeZone.model.ts'
import { DateUtil } from '#utils/date.util.ts'

export class TimeZoneUtil {
  static getAvailableTimeZones(): TimeZone[] {
    if (typeof Intl.supportedValuesOf !== 'function') {
      return []
    }

    return Intl.supportedValuesOf('timeZone')
  }

  static getCurrentTimeZone(): TimeZone {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  static getOffset(timeZone: TimeZone): string {
    const now = DateUtil.getNow()
    const zoned = now.toZonedDateTimeISO(timeZone)
    const {
      offset,
    } = zoned

    return `GMT${offset}`
  }

  static getTimeZoneLabel(timeZone: TimeZone, locale: string): string {
    const formatter = new Intl.DateTimeFormat(locale, {
      timeZone,
      timeZoneName: 'long',
    })

    const parts = formatter.formatToParts(new Date())
    const tzName = parts.find((p) => p.type === 'timeZoneName')?.value

    return tzName ?? timeZone
  }
}
