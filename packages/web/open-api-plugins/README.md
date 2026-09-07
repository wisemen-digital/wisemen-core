# OpenAPI Plugins

Plugins for [`@hey-api/openapi-ts`](https://heyapi.dev/openapi-ts/) used by Wisemen web applications.

## Generate API error-code enums

`apiErrorCode` collects the `code` values from 4xx and 5xx API error schemas and adds an `ApiErrorCode` enum to the generated TypeScript output. This lets an application keep its API error translations exhaustive.

### 1. Install and configure

Install the plugin alongside the application's existing Hey API generator:

```sh
pnpm add -D @wisemen/open-api-plugins
```

Add `defaultErrorCodeEnumConfig` to the `plugins` list in the OpenAPI configuration. When using `@wisemen/vue-core-configs`, retain its default plugins:

```ts
// openapi-ts.config.ts
import { defineConfig } from '@hey-api/openapi-ts'
import { DEFAULT_HEY_API_CONFIG, heyApiConfig } from '@wisemen/vue-core-configs'
import { defaultErrorCodeEnumConfig } from '@wisemen/open-api-plugins'

export default defineConfig(heyApiConfig({
  plugins: [
    ...DEFAULT_HEY_API_CONFIG.plugins,
    defaultErrorCodeEnumConfig,
  ],
}))
```

### 2. Generate the client

Run the application's OpenAPI generation script, for example:

```sh
pnpm openapi-ts
```

The generated TypeScript types now export `ApiErrorCode`. For example, the backend code `booqit_import_missing_id` becomes:

```ts
export enum ApiErrorCode {
  BOOQIT_IMPORT_MISSING_ID = 'booqit_import_missing_id',
}
```

The enum is added to the generated TypeScript output; it does not create a separate source file.

### 3. Define an exhaustive translation map

In the application, map every generated error code to an i18n key. `Record<ApiErrorCode, string>` makes TypeScript report any code that is missing a translation mapping after regeneration.

```ts
// src/models/api-error/apiError.model.ts
import { ApiErrorCode } from '@/client/types.gen'

const apiErrorTranslationKeys: Record<ApiErrorCode, string> = {
  [ApiErrorCode.BOOQIT_IMPORT_MISSING_ID]: 'api_error.booqit_import_missing_id',
}

export function getApiErrorTranslationKey(code: ApiErrorCode): string {
  return apiErrorTranslationKeys[code]
}
```

Add the referenced key to each application locale.

### 4. Register it once for toast errors

Pass the resolver to the root `UIConfigProvider`:

```vue
<script setup lang="ts">
import { getApiErrorTranslationKey } from '@/models/api-error/apiError.model'
</script>

<template>
  <UIConfigProvider :api-error-translation-resolver="getApiErrorTranslationKey">
    <RouterView />
  </UIConfigProvider>
</template>
```

Then error handlers only need:

```ts
toast.apiError(error)
```

If no resolver is registered, `toast.apiError(error)` keeps its default behavior and displays the backend error detail.
