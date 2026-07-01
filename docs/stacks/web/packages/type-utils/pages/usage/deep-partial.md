# DeepPartial

The `DeepPartial` utility type recursively makes all properties of a type partial (optional) at all levels. This is useful for creating update payloads, configuration objects, or any scenario where properties at any depth might be omitted.

## Definition

```typescript
export type DeepPartial<T> = T extends object
  ? {
      [K in keyof T]?: DeepPartial<T[K]>
    }
  : T
```

## Usage

### Basic Example

```typescript
interface User {
  id: string
  profile: {
    name: string
    address: {
      city: string
      zip: string
    }
  }
}

type PartialUser = DeepPartial<User>
// Result: All properties at all levels become optional
// {
//   id?: string
//   profile?: {
//     name?: string
//     address?: {
//       city?: string
//       zip?: string
//     }
//   }
// }
```

### Update Functions

Perfect for creating flexible update functions:

```typescript
function updateUser(userId: string, updates: DeepPartial<User>): Promise<void> {
  // Update only the provided fields
  // All nested properties are optional
}

// All these calls are valid:
await updateUser('123', { profile: { name: 'John' } })
await updateUser('123', { profile: {} })
await updateUser('123', { id: '456', profile: { address: { city: 'NYC' } } })
```

### Configuration Objects

Great for optional configuration:

```typescript
interface AppConfig {
  server: {
    host: string
    port: number
    ssl: {
      enabled: boolean
      certPath: string
    }
  }
}

function createApp(config: DeepPartial<AppConfig>): App {
  // Handle partial configuration
}
```

## Benefits

- **Flexibility**: Make any level of nesting optional
- **Type Safety**: Full type inference and autocomplete support
- **Reusability**: Works with any object type
- **Nested Support**: All levels are recursively made partial
