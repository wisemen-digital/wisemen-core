# API client

The `src/client/` folder is auto-generated. Do not edit it by hand.

## Generating the client

Run the following command from `apps/web`:

```bash
pnpm generate:api-client
```

This reads the OpenAPI spec defined in `openapi.config.ts` at the project root and outputs a fully typed fetch client, Zod schemas, and TypeScript types into `src/client/`.

## Configuration

Generation is configured in `openapi.config.ts`:

```typescript
import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
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
})
```

The input points to the OpenAPI spec produced by the backend. Re-run `pnpm generate:api-client` whenever the spec changes.
