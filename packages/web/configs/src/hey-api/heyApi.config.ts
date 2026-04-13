import type { UserConfig } from '@hey-api/openapi-ts'
import defu from 'defu'

export const DEFAULT_HEY_API_CONFIG: UserConfig = {
  input: '../api/dist/openapi/docs.json',
  output: 'src/client',
  plugins: [
    'zod',
    {
      name: '@hey-api/client-fetch',
      throwOnError: true,
    },
    {
      name: '@hey-api/sdk',
      auth: false,
      validator: true,
    },
    {
      name: '@hey-api/typescript',
      enums: 'typescript',
    },
  ],
}

export function heyApiConfig(overrides?: Partial<UserConfig>): UserConfig {
  return defu(overrides, DEFAULT_HEY_API_CONFIG) as UserConfig
}
