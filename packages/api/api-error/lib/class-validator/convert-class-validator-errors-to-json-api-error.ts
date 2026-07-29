import { HttpStatus } from '@nestjs/common'
import type { ValidationError } from 'class-validator'
import { snakeCase } from 'change-case'
import { JsonApiError } from '../api-errors/json-api-error.type.js'

const BAD_REQUEST_STATUS = HttpStatus.BAD_REQUEST.toString()

function getJsonPath (path: string, error: ValidationError): string {
  if (error.property.length === 0) {
    return path
  }

  const isArrayItem = Array.isArray(error.target)

  return path + (isArrayItem ? `[${error.property}]` : `.${error.property}`)
}

function convertValidationError (error: ValidationError, path: string): JsonApiError['errors'] {
  const jsonPath = getJsonPath(path, error)
  const constraintErrors = Object.entries(error.constraints ?? {}).map(([constraint, detail]) => ({
    code: `validation_error.${snakeCase(constraint)}`,
    detail,
    source: { pointer: jsonPath },
    status: BAD_REQUEST_STATUS
  }))
  const childErrors = (error.children ?? []).flatMap(child => convertValidationError(child, jsonPath))

  return [...constraintErrors, ...childErrors]
}

export function convertClassValidatorErrorsToJsonApiError (errors: ValidationError[]): JsonApiError {
  return new JsonApiError(
    HttpStatus.BAD_REQUEST,
    errors.flatMap(error => convertValidationError(error, '$'))
  )
}
