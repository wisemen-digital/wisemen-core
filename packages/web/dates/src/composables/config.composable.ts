import {
  computed,
  ref,
} from 'vue'

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

const DEFAULT_CONFIG = {
  appLanguage: LocaleUtil.getCurrentLocale(),
  hourCycle: 'locale-default',
  locale: LocaleUtil.getCurrentLocale(),
  timeZone: TimeZoneUtil.getCurrentTimeZone(),
} as const satisfies Config

const config = ref<Config>(DEFAULT_CONFIG)

function update(updatedConfig: Partial<Config>): void {
  config.value = {
    ...config.value,
    ...updatedConfig,
  }
}

export function useDateTimeConfig() {
  return {
    appLanguage: computed<Locale>(() => config.value.appLanguage),
    hourCycle: computed<HourCycle>(() => config.value.hourCycle),
    locale: computed<Locale>(() => config.value.locale),
    timeZone: computed<TimeZone>(() => config.value.timeZone),
    update,
  }
}
