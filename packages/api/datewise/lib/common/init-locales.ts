/**
 * Locales must be initialized explicitly, before they work on datewise instances
 * @param locales f.e. nl-BE, en-US
 */
export function initLocales(locales: string[]): void {
  for (let i = 0; i < locales.length; i++) {
    import('dayjs/locale/' + locales[i].toLowerCase())
  }
}