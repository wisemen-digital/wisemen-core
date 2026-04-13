# DeepNullable

The `DeepNullable` utility type recursively makes all properties of a type nullable at all nested levels. This is useful for representing partial data structures where any property at any depth could be null, such as database records or API responses.

## Definition

```typescript
export type DeepNullable<T> = T extends object
  ? {
      [K in keyof T]: DeepNullable<T[K]> | null
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
    age: number
  }
}

type NullableUser = DeepNullable<User>
// Result: All properties at all levels become nullable
// {
//   id: string | null
//   profile: {
//     name: string | null
//     age: number | null
//   } | null
// }
```

### API Response Handling

Perfect for handling API responses where fields might be null:

```typescript
interface Product {
  id: string
  name: string
  details: {
    description: string
    category: {
      name: string
      parent: {
        id: string
      }
    }
  }
}

type ApiProductResponse = DeepNullable<Product>

function processProduct(product: ApiProductResponse): void {
  // Handle potential null values at any level
  if (product.details?.category?.parent?.id) {
    // Use the parent ID
  }
}
```

### Database Records

Great for representing database records with nullable columns:

```typescript
interface UserRecord {
  id: string
  email: string
  profile: {
    firstName: string
    lastName: string
    phone: string
  }
}

type DatabaseUser = DeepNullable<UserRecord>

async function fetchUserFromDb(userId: string): Promise<DatabaseUser> {
  // Database columns might be NULL
  return await db.users.findOne(userId)
}
```

### Form State Management

Useful for handling form states where fields might not have values:

```typescript
interface FormData {
  user: {
    name: string
    contact: {
      email: string
      phone: string
    }
  }
}

type FormState = DeepNullable<FormData>

// Fields can be null or undefined during form editing
const state: FormState = {
  user: {
    name: null,
    contact: {
      email: null,
      phone: null
    }
  }
}
```

## Benefits

- **Null Safety**: Explicitly represents nullable fields at all levels
- **Type Inference**: Full TypeScript support for distinguishing between undefined and null
- **API Integration**: Perfect for representing external API schemas
- **Clarity**: Makes it explicit that fields can be null at any nesting level
