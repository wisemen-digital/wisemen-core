import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { applyDecorators, HttpStatus } from '@nestjs/common'
import type { ClassConstructor } from 'class-transformer'
import { ApiError } from '../api-errors/api-error.js'
import { BadRequestApiError } from '../api-errors/bad-request.api-error.js'
import { ConflictApiError } from '../api-errors/conflict.api-error.js'
import { NotFoundApiError } from '../api-errors/not-found.api-error.js'

export function ApiNotFoundErrorResponse (
  ...errors: Array<ClassConstructor<NotFoundApiError>>
): MethodDecorator {
  return ApiErrorResponse(HttpStatus.NOT_FOUND, errors)
}

export function ApiBadRequestErrorResponse (
  ...errors: Array<ClassConstructor<BadRequestApiError>>
): MethodDecorator {
  return ApiErrorResponse(HttpStatus.BAD_REQUEST, errors)
}

export function ApiConflictErrorResponse (
  ...errors: Array<ClassConstructor<ConflictApiError>>
): MethodDecorator {
  return ApiErrorResponse(HttpStatus.CONFLICT, errors)
}

export function ApiErrorResponse (
  status: HttpStatus,
  errors: Array<ClassConstructor<ApiError>>
): MethodDecorator {
  return applyDecorators(
    ApiExtraModels(...errors),
    createApiResponseDecorator(status, errors)
  )
}

function createApiResponseDecorator (
  status: HttpStatus,
  errors: Array<ClassConstructor<ApiError>>
): MethodDecorator {
  const errorDocs = errors.map(error => ({ $ref: getSchemaPath(error) }))

  return ApiResponse({
    status,
    schema: {
      type: 'object',
      properties: {
        traceId: { type: 'string', nullable: true },
        errors: {
          type: 'array',
          items: { anyOf: errorDocs }
        }
      }
    }
  })
}
