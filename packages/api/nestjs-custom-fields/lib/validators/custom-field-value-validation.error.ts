import { ApiErrorCode, BadRequestApiError } from '@wisemen/api-error'

export class CustomFieldValueValidationError extends BadRequestApiError {
  @ApiErrorCode('custom_field_value_validation')
  code = 'custom_field_value_validation'

  meta: never

  constructor (details: string) {
    super(details)
  }
}
