import {
  computed,
  ref,
} from 'vue'

import type { Locale } from '@/models/locale.model'

export interface DataFormatConfig {
  /**
   * The locale to use for locale-aware formatting (e.g. list formatting, number formatting, pluralization).
   * If not provided, the browser's default locale will be used.
   */
  locale: Locale
}

const DEFAULT_LOCALE: Locale
  = typeof navigator !== 'undefined'
    ? navigator.language
    : Intl.DateTimeFormat().resolvedOptions().locale

const DEFAULT_CONFIG: DataFormatConfig = {
  locale: DEFAULT_LOCALE,
}

const config = ref<DataFormatConfig>(DEFAULT_CONFIG)

function update(updatedConfig: Partial<DataFormatConfig>): void {
  config.value = {
    ...config.value,
    ...updatedConfig,
  }
}

export function useDataFormatConfig() {
  return {
    locale: computed<Locale>(() => config.value.locale),
    update,
  }
}
