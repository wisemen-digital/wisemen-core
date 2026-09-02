import { HttpStatus } from '@nestjs/common'
import type { ValidationError } from 'class-validator'
import { snakeCase } from 'change-case'
import type { JsonApiErrorContent } from '../api-errors/json-api-error.type.js'
import { JsonApiError } from '../api-errors/json-api-error.type.js'

function convertValidationError (errors: ValidationError[], path = '$'): JsonApiErrorContent[] {
  const convertedErrors: JsonApiErrorContent[] = []

  for (const error of errors) {
    const isArray = Array.isArray(error.target)
    const jsonPath = path + (isArray ? `[${error.property}]` : `.${error.property}`)

    if (error.children === undefined || error.children.length === 0) {
      if (error.constraints !== undefined) {
        const validationConstraintName = Object.keys(error.constraints)[0]

        convertedErrors.push({
          source: { pointer: jsonPath },
          code: `validation_error.${snakeCase(validationConstraintName)}`,
          detail: Object.values(error.constraints)[0]
        })
      }
    } else {
      convertedErrors.push(...convertValidationError(error.children, jsonPath))
    }
  }

  return convertedErrors
}

export function convertClassValidatorErrorsToJsonApiError (errors: ValidationError[]): JsonApiError {
  const errorContents = convertValidationError(errors)

  return new JsonApiError(HttpStatus.BAD_REQUEST, errorContents)
}
