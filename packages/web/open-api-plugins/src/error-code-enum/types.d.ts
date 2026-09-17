import type {
  DefinePlugin,
  Plugin,
} from '@hey-api/openapi-ts'

export type ErrorCodeEnumConfig = {
  name: 'apiErrorCode'
} & Plugin.Hooks
& Plugin.UserExports

export type ErrorCodeEnumPlugin = DefinePlugin<ErrorCodeEnumConfig>
