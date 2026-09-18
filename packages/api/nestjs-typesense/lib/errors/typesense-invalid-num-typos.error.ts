import { ApiErrorCode } from '@wisemen/api-error'
import { BadRequestApiError } from '@wisemen/api-error'

export class TypesenseInvalidNumTyposError extends BadRequestApiError {
  @ApiErrorCode('typesense_invalid_num_typos')
  code = 'typesense_invalid_num_typos'

  meta: never

  constructor (numTypos: number, max: number) {
    super(`numTypos must be between 0 and ${max}, received ${numTypos}`)
  }
}
