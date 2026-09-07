import type {
  DefinePlugin,
  Plugin,
} from '@hey-api/openapi-ts'

export type ErrorCodeEnumConfig = Plugin.Name<'error-code-enum-plugin'>
  & Plugin.Hooks
  & Plugin.UserExports

export type ErrorCodeEnumPlugin = DefinePlugin<ErrorCodeEnumConfig>
