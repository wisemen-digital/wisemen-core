import { computed } from 'vue'

import { getLocaleFromNumberFormat } from '@/types/numberFormat.type'
import { useInjectConfigContext } from '@/ui'

function format(value: number, locale: string, precision = 0): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: precision,
  }).format(value)
}

export function useNumberFormat() {
  const config = useInjectConfigContext()

  const locale = computed<string>(() => {
    const format = config.numberFormat?.value

    return getLocaleFromNumberFormat(format)
  })

  return {
    format(value: number, precision?: number): string {
      return format(value, locale.value, precision)
    },
    locale,
  }
}
