import { DatewiseLocale, LOCALES } from "#src/common/locale.js";

/** 
 * Do a best effort to map a locale string to a locale supported by datewise / dayjs.
 */
export function mapLocale(locale: string): DatewiseLocale {
  locale = locale.toLowerCase()
  
  if(LOCALES.has(locale as DatewiseLocale)) {
    return locale as DatewiseLocale
  }
  
  const hyphenIdx = locale.indexOf('-')
  if(hyphenIdx > 0) { 
    const baseLocale = locale.slice(0,hyphenIdx)
    if (LOCALES.has(baseLocale as DatewiseLocale)) {
      return  baseLocale as DatewiseLocale
    }
  }

  return 'en'
}