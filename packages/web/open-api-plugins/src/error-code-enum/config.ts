import { definePluginConfig } from '@hey-api/openapi-ts'

import { handler } from './plugin'
import type { ErrorCodeEnumPlugin } from './types'

export const defaultConfig: ErrorCodeEnumPlugin['Config'] = {
  name: 'error-code-enum-plugin',
  config: {
    myOption: false, // implements default value from types
  },
  dependencies: [
    '@hey-api/typescript',
  ],
  handler,
  output: 'apiErrorCode',
}

/**
 * Type helper for `my-plugin` plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig)
