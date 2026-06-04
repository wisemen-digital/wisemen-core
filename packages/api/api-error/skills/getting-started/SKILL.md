---
name: getting-started
description: Define custom API errors. Use when throwing errors in an api.
---

# Define custom errors.

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

# Document errors thrown with @ApiErrorResponse on Controllers (swagger)

```ts
import { ApiNotFoundErrorResponse } from "@wisemen/api-error"

...
export class ViewUserDetailController {
  
  ...
  @ApiErrorResponse(UserNotFoundError)
  async findOne(...): Promise<UserDto> {
    ...
  }
}
```

### Test errors thrown with toHaveApiError

```ts
it("returns 404 for unknown user", async () => {
  const response = await request(...).get(...)
  expect(response).toHaveApiError(new UserNotFoundError())
})
```

### Advanced: error with metadata. Use when asked to return metadata to frontend.

```ts
import { BadRequestApiError, ApiErrorCode, ApiErrorMeta, } from "@wisemen/api-error"

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

# Exported base errors
  - ApiError
  - BadRequestApiError
  - UnauthorizedApiError
  - ForbiddenApiError
  - NotFoundApiError
  - ConflictApiError
  - InternalServerApiError
  - ServiceUnavailableApiError
  - ErrorSource
  - JsonApiErrorContent
  - JsonApiError
  - CompositeApiError
  - NotFoundCompositeApiError
  - BadRequestCompositeApiError
