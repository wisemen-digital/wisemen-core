import {
  onBeforeUnmount,
  onMounted,
  toValue,
} from 'vue'

import type { MaybeRefOrGetter } from 'vue'

interface UsePdfLocaleOptions {
  getCurrentLocale: () => string
  locale: MaybeRefOrGetter<string | null>
  setLocale: (locale: string) => void
  fallbackLocale?: MaybeRefOrGetter<string> | null
}

export type PdfLocaleReturn = ReturnType<typeof usePdfLocale>

export function usePdfLocale(options: UsePdfLocaleOptions) {
  let previousLocale: string | null = null

  function applyLocale(): void {
    const locale = toValue(options.locale)

    if (locale === null) {
      return
    }

    previousLocale = options.getCurrentLocale()
    options.setLocale(locale)
  }

  function restoreLocale(): void {
    const fallbackLocale = options.fallbackLocale === undefined || options.fallbackLocale === null
      ? null
      : toValue(options.fallbackLocale)

    const locale = previousLocale ?? fallbackLocale

    if (locale === null) {
      return
    }

    options.setLocale(locale)
  }

  onMounted(() => {
    applyLocale()
  })

  onBeforeUnmount(() => {
    restoreLocale()
  })

  return {
    applyLocale,
    restoreLocale,
  }
}
