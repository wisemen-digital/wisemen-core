# @repo/api-errors

Shared API error classes.

## Overview

This package provides a standardized error handling system for API applications. It includes:

- Base error classes (`ApiError`, `CompositeApiError`)
- Specific error types (NotFound, BadRequest, Forbidden, etc.)
- JSON API error formatting
- Error decorators for metadata, codes, and status
- Swagger/OpenAPI documentation support

## Usage

```typescript
import { NotFoundApiError, ApiErrorCode } from '@repo/api-errors'

export class UserNotFoundError extends NotFoundApiError {
  @ApiErrorCode('user_not_found')
  readonly code = 'user_not_found'
  
  meta: never

  constructor (userId: string) {
    super(`User with id ${userId} not found`)
  }
}
```

## Features

### Base Classes

- `ApiError` - Base class for all API errors with automatic JSON API conversion
- `CompositeApiError` - For grouping multiple errors together

### Error Types

- `BadRequestApiError` - 400 errors
- `UnauthorizedError` - 401 errors
- `ForbiddenApiError` - 403 errors
- `NotFoundApiError` - 404 errors
- `ConflictApiError` - 409 errors
- `InternalServerApiError` - 500 errors
- `ServiceUnavailableApiError` - 503 errors

### JSON API Format

All errors automatically convert to JSON API format via the `toJsonApiError()` method:

```typescript
{
  status: 404,
  errors: [{
    code: "user_not_found",
    detail: "User with id 123 not found",
    status: "404"
  }]
}
```

### Decorators

- `@ApiErrorCode(code: string)` - Set the error code
- `@ApiErrorStatus(status: HttpStatus)` - Set the HTTP status
- `@ApiErrorMeta()` - Define metadata structure
- `@ApiNotFoundErrorResponse()` - Swagger documentation helpers

## Dependencies

- `@nestjs/common` - NestJS common utilities
- `@nestjs/swagger` - OpenAPI/Swagger decorators
- `@sentry/nestjs` - Error tracking integration
- `class-transformer` - Type transformation
