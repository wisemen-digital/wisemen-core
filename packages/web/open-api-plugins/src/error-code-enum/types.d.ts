import type { DefinePlugin } from '@hey-api/openapi-ts'

export interface ErrorCodeEnumConfig {
  /**
   * Plugin name. Must be unique.
   */
  name: 'error-code-enum-plugin'
  /**
   * Name of the generated file.
   *
   * @default 'my-plugin'
   */
  output?: string
}

export type ErrorCodeEnumPlugin = DefinePlugin<ErrorCodeEnumConfig>
