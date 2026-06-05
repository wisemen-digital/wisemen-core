import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { applyDecorators, HttpStatus } from '@nestjs/common'
import type { ClassConstructor } from 'class-transformer'
import { ApiError } from '../api-errors/api-error.js'
import { getApiErrorStatusMetadata } from './api-error-status.decorator.js'

/**
 * This decorator defines error response docs for `@nestjs/swagger`.
 * It adds the errors to `@ApiExtraModels()` and creates a `@ApiResponse()` for each http status code.
 * 
 * @param errors must be an array of classes that have the `@ApiStatusCode()` decorator applied x
 * to any class member.
 */
export function ApiErrorResponse (
  ...errors: Array<ClassConstructor<ApiError>>
): MethodDecorator {
  const statusMap = new Map<HttpStatus, ClassConstructor<ApiError>[]>()
  
  for (const err of errors) {
    const status = getApiErrorStatusMetadata(err.prototype as object)
    const statusErrors = statusMap.get(status) ?? []
    statusErrors.push(err)
    statusMap.set(status, statusErrors)
  }

  const apiResponseDecorators: MethodDecorator[] = []
  for (const [status, errors] of statusMap.entries()) {
    apiResponseDecorators.push(createApiResponseDecorator(status, errors))
  }

  return applyDecorators(
    ApiExtraModels(...errors),
    ...apiResponseDecorators
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
