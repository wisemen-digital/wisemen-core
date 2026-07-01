# Hey-API Configuration

Generate type-safe API clients from OpenAPI specifications using Hey-API code generator.

## Basic usage

```typescript
// openapi-ts.config.ts
import { defineConfig } from '@hey-api/openapi-ts'
import { heyApiConfig } from '@wisemen/vue-core-configs'

export default defineConfig(
  heyApiConfig(),
)
```

## Default configuration

The configuration includes:

- **Input/Output**: Configurable paths for OpenAPI spec and generated code
- **Zod Plugin**: Automatic Zod schema generation for validation
- **Client**: Fetch-based HTTP client with error throwing enabled
- **SDK**: Type-safe SDK generation with auth support disabled
- **TypeScript**: Generated TypeScript with enums as type definitions

## Common overrides

### Custom input/output paths

```typescript
heyApiConfig({
  input: './specs/openapi.json',
  output: 'src/client',
})
```

### Customize and override properties

```typescript
heyApiConfig({
  input: './specs/openapi.json',
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
    // Add your plugins here
  ],
})
```
