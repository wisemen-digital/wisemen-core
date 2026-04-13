export interface DefaultConfigOptions {
  /**
   * Path to the folder containing i18n locale files.
   * @default './src/locales/*.json'
   */
  localesFolderPath?: string
  /**
   * Path to the Tailwind CSS configuration file.
   * @default './src/assets/styles/index.css'
   */
  tailwindConfigPath?: string
  /**
   * Root font size for Tailwind CSS canonical class enforcement
   * @default 16
   */
  tailwindRootFontSize?: number

}
