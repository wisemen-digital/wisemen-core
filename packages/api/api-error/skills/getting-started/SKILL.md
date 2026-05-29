---
name: getting-started
description: >
  Define custom API errors by extending NotFoundApiError, BadRequestApiError, etc.
  Decorate with @ApiErrorCode for Swagger docs, and document controllers with
  ApiNotFoundErrorResponse. Test with toHaveApiError().
type: lifecycle
library: api-error
exports:
  - ApiError
  - BadRequestApiError
  - UnauthorizedApiError
  - ForbiddenApiError
  - NotFoundApiError
  - ConflictApiError
  - InternalServerApiError
  - ServiceUnavailableApiError
  - CompositeApiError
  - ApiErrorCode
  - ApiErrorMeta
  - ApiNotFoundErrorResponse
  - ApiBadRequestErrorResponse
  - ApiConflictErrorResponse
  - toHaveApiError
---

# @wisemen/api-error — Getting Started

Standardized JSON:API error responses for NestJS with typed error codes, Swagger documentation decorators, and test matchers.

## When to Use

- Returning structured error responses following JSON:API format
- Documenting error responses in Swagger/OpenAPI
- Creating domain-specific error types with typed codes and metadata
- Testing that endpoints return specific errors

## Import

```ts
import {
  NotFoundApiError, BadRequestApiError, ApiErrorCode, ApiErrorMeta,
  ApiNotFoundErrorResponse, ApiBadRequestErrorResponse,
} from '@wisemen/api-error'
```

## Quick Start

### 1. Define a custom error

```ts
import { NotFoundApiError, ApiErrorCode } from "@wisemen/api-error"

export class UserNotFoundError extends NotFoundApiError {
  @ApiErrorCode("user_not_found")
  readonly code = "user_not_found"

  constructor() {
    super("The requested user was not found")
  }
}
```

### 2. Throw from a service

```ts
@Injectable()
export class UserService {
  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id })

    if (user === null) {
      throw new UserNotFoundError()
    }

    return user
  }
}
```

### 3. Document on the controller

```ts
import { ApiNotFoundErrorResponse } from "@wisemen/api-error"

@Controller("users")
export class UserController {
  @Get(":id")
  @ApiNotFoundErrorResponse(UserNotFoundError)
  async findOne(@Param("id") id: string): Promise<UserDto> {
    return this.userService.findById(id)
  }
}
```

### 4. Test with toHaveApiError

```ts
import { toHaveApiError } from "@wisemen/api-error"

expect.extend({ toHaveApiError })

it("returns 404 for unknown user", async () => {
  const response = await request(app).get("/users/unknown")
  expect(response).toHaveApiError(new UserNotFoundError())
})
```

### Error with metadata

```ts
import {
  BadRequestApiError,
  ApiErrorCode,
  ApiErrorMeta,
} from "@wisemen/api-error"

export class InvalidEmailApiErrorMeta {
  field: string

  constructor(field: string) {
    this.field = field
  }
}

export class InvalidEmailError extends BadRequestApiError {
  @ApiErrorCode("invalid_email")
  readonly code = "invalid_email"

  @ApiErrorMeta()
  readonly meta: InvalidEmailApiErrorMeta

  constructor(field: string) {
    super("The email address is invalid")
    this.meta = new InvalidEmailApiErrorMeta(field)
  }
}
```

## Source Files

For full API details, read the source files.

- Base class: `lib/api-errors/api-error.ts`
- Error subclasses: `lib/api-errors/bad-request.api-error.ts`, `lib/api-errors/not-found.api-error.ts`, `lib/api-errors/forbidden.api-error.ts`, `lib/api-errors/conflict.api-error.ts`, `lib/api-errors/unauthorized.api-error.ts`
- Composite errors: `lib/api-errors/composite-api-error.ts`
- Decorators: `lib/decorators/api-error-code.decorator.ts`, `lib/decorators/api-error-meta.decorator.ts`
- Swagger decorators: `lib/decorators/api-error-response.decorator.ts`
- Test matcher: `lib/expect/expect-api-error.ts`
- JSON:API types: `lib/api-errors/json-api-error.type.ts`
