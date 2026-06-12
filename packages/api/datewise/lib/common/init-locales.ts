import { mapLocale } from "#src/common/map-locale.js";

/**
 * Locales must be initialized explicitly, before they work on datewise instances
 * Only the locales from DateWiseLocale are supported.
 * This function will do a best effort to map the given locale strings to supported locales.
 * @param locales f.e. nl-BE, en-US
 */
export async function initLocales(locales: string[]): Promise<void> {
  for (let i = 0; i < locales.length; i++) {
    await import('dayjs/locale/' + mapLocale(locales[i]) + '.js')
  }
}
