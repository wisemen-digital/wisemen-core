import type { Composer } from 'vue-i18n'

export interface ZodValidationConfig {
  i18nInstance: Composer
}

let zodValidationConfig: ZodValidationConfig

export function initializeZodValidationConfig(config: ZodValidationConfig): void {
  zodValidationConfig = config
}

export function getZodValidationConfig(): ZodValidationConfig {
  if (!zodValidationConfig) {
    throw new Error('ZodValidationConfig has not been initialized. Please call initializeZodValidationConfig first.')
  }

  return zodValidationConfig
}
