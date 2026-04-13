# Services Layer

This document explains how to create service classes that act as the bridge between your Vue components and the API utils. Services use `ApiUtil.fromPromise` to handle API calls and return `ApiResult` types for proper error handling.

## ApiUtil Helper

Create a utility to wrap API calls without try-catch:

```typescript
// src/utils/api.util.ts

import type { ApiResult } from '@/api'
import { ResultAsync } from 'neverthrow'

export class ApiUtil {
  /**
   * Wraps a promise from an API call and converts it to an ApiResult
   * This eliminates the need for try-catch blocks in services
   */
  static async fromPromise<T>(
    promise: Promise<T>,
    errorHandler?: (error: unknown) => { code: string; message: string }
  ): Promise<ApiResult<T>> {
    return await ResultAsync.fromPromise(promise, (error) => {
      if (errorHandler) {
        return errorHandler(error)
      }
      
      // Default error handling
      return {
        code: 'ERROR',
        message: error instanceof Error ? error.message : 'An error occurred',
      }
    })
  }
}
```

## Service Structure with Transformers

Here's a real-world example using transformers to convert between DTOs and domain models:

```typescript
// src/services/contact.service.ts

import type { OffsetPagination } from '@wisemen/vue-core-api-utils'
import {
  createContactV1,
  deleteContactV1,
  updateContactV1,
  viewContactDetailV1,
  viewContactIndexV1,
} from '@/client'
import type {
  ApiResult,
  OffsetPaginationResult,
} from '@/api'
import type { ContactUuid } from '@/types'
import { ContactCreateTransformer } from '@/transformers/contact-create.transformer'
import type { ContactCreateForm } from '@/types'
import type { ContactDetail } from '@/types'
import { ContactDetailTransformer } from '@/transformers/contact-detail.transformer'
import type { ContactIndex } from '@/types'
import { ContactIndexTransformer } from '@/transformers/contact-index.transformer'
import type { ContactIndexQueryParams } from '@/types'
import { ContactIndexQueryParamsTransformer } from '@/transformers/contact-index-params.transformer'
import { ContactUpdateTransformer } from '@/transformers/contact-update.transformer'
import type { ContactUpdateForm } from '@/types'
import { ApiUtil } from '@/utils/api.util'

export class ContactService {
  // Create - Transform form to DTO, call API, extract UUID
  static async create(form: ContactCreateForm): Promise<ApiResult<ContactUuid>> {
    const dto = ContactCreateTransformer.toDto(form)
    const result = await ApiUtil.fromPromise(
      createContactV1({ body: dto })
    )
    
    return result.map((res) => res.data.uuid as ContactUuid)
  }

  // Delete - No response data
  static async delete(contactUuid: ContactUuid): Promise<ApiResult<void>> {
    const result = await ApiUtil.fromPromise(
      deleteContactV1({
        path: { uuid: contactUuid },
      })
    )
    
    return result.map(() => undefined)
  }

  // Get paginated list - Transform query params and response
  static async getAll(
    params: OffsetPagination<ContactIndexQueryParams>,
  ): Promise<OffsetPaginationResult<ContactIndex>> {
    const result = await ApiUtil.fromPromise(
      viewContactIndexV1({
        query: ContactIndexQueryParamsTransformer.toDto(params),
      })
    )

    return result.map((response) => ({
      data: response.data.items.map(ContactIndexTransformer.fromDto),
      meta: response.data.meta,
    }))
  }

  // Get single resource - Transform DTO to domain model
  static async getByUuid(contactUuid: ContactUuid): Promise<ApiResult<ContactDetail>> {
    const result = await ApiUtil.fromPromise(
      viewContactDetailV1({
        path: { uuid: contactUuid },
      })
    )

    return result.map((response) => 
      ContactDetailTransformer.fromDto(response.data)
    )
  }

  // Update - Transform form to DTO, no response data
  static async update(
    contactUuid: ContactUuid,
    form: ContactUpdateForm
  ): Promise<ApiResult<void>> {
    const dto = ContactUpdateTransformer.toDto(form)
    const result = await ApiUtil.fromPromise(
      updateContactV1({
        body: dto,
        path: { uuid: contactUuid },
      })
    )

    return result.map(() => undefined)
  }
}
```

## Consuming Services in Composables

Composables wrap services with the query/mutation composables:

```typescript
// src/composables/useContact.ts

import { useQuery, useMutation, useOffsetInfiniteQuery } from '@/api'
import { ContactService } from '@/services'
import type { ContactCreateForm, ContactUpdateForm } from '@/types'

// Query for a single contact
export function useContact(contactId: string) {
  return useQuery('contactDetail', {
    params: { contactId: computed(() => contactId) },
    queryFn: () => ContactService.getById(contactId),
    staleTime: 1000 * 60 * 5,
  })
}

// Query for contact list with pagination
export function useContactList(options?: { search?: string; filters?: any }) {
  const search = ref(options?.search || '')
  const filters = ref(options?.filters || {})
  
  return useOffsetInfiniteQuery('contactList', {
    params: {
      search: computed(() => search.value),
      filters: computed(() => filters.value),
    },
    queryFn: (pagination) => ContactService.getAll({
      search: search.value,
      filters: filters.value,
      ...pagination,
    }),
  })
}

// Mutation to create contact
export function useCreateContact() {
  return useMutation({
    queryFn: (body: ContactCreateForm) => ContactService.create(body),
    queryKeysToInvalidate: {
      contactList: {},
    },
  })
}

// Mutation to update contact
export function useUpdateContact(contactId: string) {
  return useMutation({
    queryFn: (body: ContactUpdateForm) => ContactService.update(contactId, body),
    queryKeysToInvalidate: {
      contactDetail: { contactId },
      contactList: {},
    },
  })
}

// Mutation to delete contact
export function useDeleteContact() {
  return useMutation({
    queryFn: (contactId: string) => ContactService.delete(contactId),
    queryKeysToInvalidate: {
      contactList: {},
    },
  })
}
```

## Custom Error Handling

For specific error scenarios, you can provide custom error handlers:

```typescript
export class UserService {
  private static handleApiError(error: unknown) {
    if (error instanceof NetworkError) {
      return { code: 'NETWORK_ERROR', message: 'Network request failed' }
    }
    
    if (error instanceof TimeoutError) {
      return { code: 'TIMEOUT', message: 'Request timed out' }
    }
    
    // Default error
    return {
      code: 'ERROR',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  static async getById(id: string): Promise<ApiResult<User>> {
    return await ApiUtil.fromPromise(
      UserApi.getById(id),
      (error) => this.handleApiError(error)
    )
  }
}
```

## Data Transformation in Services

Services can transform API DTOs to domain models using the `map` method:

```typescript
import type { UserDto } from '@/client'
import type { User } from '@/types'

export class UserService {
  static async getById(id: string): Promise<ApiResult<User>> {
    return await ApiUtil.fromPromise(
      UserApi.getById(id)
    ).then((result) => 
      // Transform DTO to domain model
      result.map((dto) => ({
        id: dto.id,
        name: `${dto.firstName} ${dto.lastName}`,
        email: dto.emailAddress,
        avatar: dto.avatarUrl || null,
      }))
    )
  }
}
```

## Benefits of ApiUtil.fromPromise

1. **No try-catch blocks** - Cleaner, more readable code
2. **Consistent error handling** - All errors follow the same pattern
3. **Type-safe** - Full TypeScript support throughout the chain
4. **Composable** - Chain operations with `.map()` and `.andThen()`
5. **No throwing** - Errors are values, not exceptions

Returns paginated data with metadata:

```typescript
static async getAll(
  params: OffsetPagination<ContactIndexQueryParams>,
): Promise<OffsetPaginationResult<ContactIndex>> {
  // Transform query parameters to API format
  const result = await ApiUtil.fromPromise(
    viewContactIndexV1({
      query: ContactIndexQueryParamsTransformer.toDto(params),
    }),
  )

  // Transform response items and include pagination metadata
  return result.map((response) => ({
    data: response.data.items.map(ContactIndexTransformer.fromDto),
    meta: response.data.meta,
  }))
}
```

**Usage in Infinite Query:**

```typescript
export function useContactIndexQuery(options: InfiniteQueryOptions<ContactIndexQueryParams>) {
  return useOffsetInfiniteQuery({
    queryFn: (pagination) => ContactService.getAll({
      filters: options.params.filters.value,
      pagination,
      search: options.params.search.value,
      sort: options.params.sort.value,
    }),
    queryKey: {
      contactIndex: {
        queryParams: options.params,
      },
    },
  })
}
```

### Update Operation

Returns void on success:

```typescript
static async update(contactUuid: ContactUuid, form: ContactUpdateForm): Promise<ApiResult<void>> {
  // Transform form to DTO
  const dto = ContactUpdateTransformer.toDto(form)

  // Call API with path parameters and body
  const result = await ApiUtil.fromPromise(
    updateContactV1({
      body: dto,
      responseValidator: undefined, // Skip response validation if no body expected
      path: {
        uuid: contactUuid,
      },
    }),
  )

  // Return void result
  return result.map((res) => res.data)
}
```

**Usage in Mutation:**

```typescript
export function useContactUpdateMutation() {
  return useMutation({
    queryFn: async (queryOptions: {
      body: ContactUpdateForm
      params: { contactUuid: ContactUuid }
    }) => {
      return await ContactService.update(queryOptions.params.contactUuid, queryOptions.body)
    },
    queryKeysToInvalidate: {
      contactDetail: {
        contactUuid: (params) => params.contactUuid,
      },
      contactIndex: {},
    },
  })
}
```

### Delete Operation

Returns void on success:

```typescript
static async delete(contactUuid: ContactUuid): Promise<ApiResult<void>> {
  const result = await ApiUtil.fromPromise(
    deleteContactV1({
      responseValidator: undefined, // Skip response validation for delete
      path: {
        uuid: contactUuid,
      },
    }),
  )

  return result.map((res) => res.data)
}
```

**Usage in Mutation:**

```typescript
export function useContactDeleteMutation() {
  return useMutation({
    queryFn: async (queryOptions: { params: { contactUuid: ContactUuid } }) => {
      return await ContactService.delete(queryOptions.params.contactUuid)
    },
    queryKeysToInvalidate: {
      contactIndex: {},
    },
  })
}
```

## Complete Service Example

```typescript
export class ContactService {
  static async create(form: ContactCreateForm): Promise<ApiResult<ContactUuid>> {
    const dto = ContactCreateTransformer.toDto(form)
    const result = await ApiUtil.fromPromise(createContactV1({
      body: dto,
    }))

    return result.map((res) => res.data.uuid as ContactUuid)
  }

  static async delete(contactUuid: ContactUuid): Promise<ApiResult<void>> {
    const result = await ApiUtil.fromPromise(
      deleteContactV1({
        responseValidator: undefined,
        path: {
          uuid: contactUuid,
        },
      }),
    )

    return result.map((res) => res.data)
  }

  static async getAll(
    params: OffsetPagination<ContactIndexQueryParams>,
  ): Promise<OffsetPaginationResult<ContactIndex>> {
    const result = await ApiUtil.fromPromise(
      viewContactIndexV1({
        query: ContactIndexQueryParamsTransformer.toDto(params),
      }),
    )

    return result.map((response) => ({
      data: response.data.items.map(ContactIndexTransformer.fromDto),
      meta: response.data.meta,
    }))
  }

  static async getByUuid(contactUuid: ContactUuid): Promise<ApiResult<ContactDetail>> {
    const result = await ApiUtil.fromPromise(viewContactDetailV1({
      path: {
        uuid: contactUuid,
      },
    }))

    return result.map((response) => {
      return ContactDetailTransformer.fromDto(response.data)
    })
  }

  static async update(contactUuid: ContactUuid, form: ContactUpdateForm): Promise<ApiResult<void>> {
    const dto = ContactUpdateTransformer.toDto(form)
    const result = await ApiUtil.fromPromise(
      updateContactV1({
        body: dto,
        responseValidator: undefined,
        path: {
          uuid: contactUuid,
        },
      }),
    )

    return result.map((res) => res.data)
  }
}
```

## Data Transformation Flow

### Outgoing Data (Request)

1. **Form/Model** → Transformer.toDto() → **DTO** → API Client

```typescript
const dto = ContactCreateTransformer.toDto(form)
const result = await ApiUtil.fromPromise(createContactV1({ body: dto }))
```

### Incoming Data (Response)

1. API Client → **DTO** → Transformer.fromDto() → **Domain Model**

```typescript
return result.map((response) => {
  return ContactDetailTransformer.fromDto(response.data)
})
```

### Query Parameters

1. **Query Params Model** → Transformer.toDto() → **API Query Format**

```typescript
const result = await ApiUtil.fromPromise(
  viewContactIndexV1({
    query: ContactIndexQueryParamsTransformer.toDto(params),
  }),
)
```

## Type Safety

Services ensure type safety throughout the entire data flow:

```typescript
// Input is typed
static async create(form: ContactCreateForm): Promise<ApiResult<ContactUuid>> {
  //                        ^^^^^^^^^^^^^^^^                       ^^^^^^^^^^^
  //                        Form type                              Return type

  const dto = ContactCreateTransformer.toDto(form)
  //    ^^^
  //    DTO type inferred from transformer

  const result = await ApiUtil.fromPromise(createContactV1({ body: dto }))
  //    ^^^^^^
  //    ApiResult<APIResponse> inferred

  return result.map((res) => res.data.uuid as ContactUuid)
  //                                         ^^^^^^^^^^^^
  //                                         Explicit type cast
}
```

## Error Handling

All service methods return `ApiResult`, forcing consumers to handle errors:

```typescript
// In a mutation or query
const result = await ContactService.create(form)

// Must handle both success and error cases
result.match(
  (contactUuid) => {
    // Success case - contactUuid is typed as ContactUuid
    console.log('Created contact:', contactUuid)
  },
  (error) => {
    // Error case - error is typed as ApiError
    console.error('Failed to create contact:', error)
  }
)
```

## Integration with Queries and Mutations

Services are consumed by queries and mutations:

```typescript
// Query uses service
export function useContactDetailQuery(contactUuid: ComputedRef<ContactUuid>) {
  return useQuery({
    queryFn: () => ContactService.getByUuid(toValue(contactUuid)),
    queryKey: { contactDetail: { contactUuid } },
  })
}

// Mutation uses service
export function useContactCreateMutation() {
  return useMutation({
    queryFn: async (queryOptions: { body: ContactCreateForm }) => {
      return await ContactService.create(queryOptions.body)
    },
    queryKeysToInvalidate: { contactIndex: {} },
  })
}
```

## Related Documentation

- [Query Documentation](./query.md) - Single resource fetching with `useQuery`
- [Paginated Query Documentation](./paginated-query.md) - Paginated data with infinite scrolling
- [Mutations Documentation](./mutation.md) - Create, update, and delete operations
- [Main Usage Documentation](./overview.md) - Complete package overview
