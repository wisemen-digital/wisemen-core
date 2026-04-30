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

export interface PackageConfigOptions extends DefaultConfigOptions {
  /**
   * If true, disables all Tailwind CSS related linting rules.
   * Useful for projects that do not use Tailwind or want to opt out of its linting.
   * @default false
   */
  tailwindDisabled?: boolean
}
