import { BadRequestApiError, ApiErrorCode } from '@wisemen/api-error'
import type { NatsPipeTransform } from './nats-pipe-transform.js'

export class NatsSubjectParamMissingError extends BadRequestApiError {
  @ApiErrorCode('nats_subject_param_missing')
  code = 'nats_subject_param_missing'

  meta: never
}

export class NatsSubjectParamExistsValidationPipe implements NatsPipeTransform {
  transform (value: unknown): unknown {
    if (value === undefined) {
      throw new NatsSubjectParamMissingError('missing nats subject parameter')
    }

    return value
  }
}
