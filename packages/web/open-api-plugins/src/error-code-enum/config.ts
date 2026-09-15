import { definePluginConfig } from '@hey-api/openapi-ts'

import { handler } from './plugin'
import type { ErrorCodeEnumPlugin } from './types'

export const defaultConfig: ErrorCodeEnumPlugin['Config'] = {
  name: 'apiErrorCode',
  config: {},
  dependencies: [
    '@hey-api/typescript',
  ],
  handler,
}

/**
 * Type helper for `my-plugin` plugin, returns {@link Plugin.Config} object
 */
export const defineConfig = definePluginConfig(defaultConfig)
