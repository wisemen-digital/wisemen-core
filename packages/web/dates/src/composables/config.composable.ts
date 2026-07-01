import type { Ref } from 'vue'
import {
  computed,
  ref,
} from 'vue'

import type { DateFormat } from '#models/dateFormat.model.ts'
import type { HourCycle } from '#models/hourCycle.model.ts'
import type { Locale } from '#models/locale.model.ts'
import type { TimeZone } from '#models/timeZone.model.ts'
import { LocaleUtil } from '#utils/locale.util.ts'
import { TimeZoneUtil } from '#utils/timeZone.util.ts'

export interface Config {
  /**
   * The language to use for app content. This is separate from the locale, which is used for date and time formatting.
   * If not provided, the device's default language will be used.
   */
  appLanguage: Locale
  /**
   * The format to use for date display.
   * If not provided, the device's default format based on locale will be used.
   */
  dateFormat: DateFormat
  /**
   * The hour cycle to use for time formatting.
   * If not provided, the device's default hour cycle will be used.
   */
  hourCycle: HourCycle
  /**
   * The locale to use for date and time formatting.
   * If not provided, the device's default locale will be used.
   */
  locale: Locale
  /**
   * The time zone to use for date and time formatting.
   * If not provided, the device's default time zone will be used.
   */
  timeZone: TimeZone
}

let config: Ref<Config> | null = null

function getConfig(): Ref<Config> {
  if (config === null) {
    config = ref<Config>({
      appLanguage: LocaleUtil.getCurrentLocale(),
      dateFormat: 'locale-default',
      hourCycle: 'locale-default',
      locale: LocaleUtil.getCurrentLocale(),
      timeZone: TimeZoneUtil.getCurrentTimeZone(),
    })
  }

  return config
}

export function useDateTimeConfig() {
  const cfg = getConfig()

  function update(updatedConfig: Partial<Config>): void {
    cfg.value = {
      ...cfg.value,
      ...updatedConfig,
    }
  }

  return {
    appLanguage: computed<Locale>(() => cfg.value.appLanguage),
    dateFormat: computed<DateFormat>(() => cfg.value.dateFormat),
    hourCycle: computed<HourCycle>(() => cfg.value.hourCycle),
    locale: computed<Locale>(() => cfg.value.locale),
    timeZone: computed<TimeZone>(() => cfg.value.timeZone),
    update,
  }
}
