import { isUUID } from 'class-validator'
import { BadRequestApiError, ApiErrorCode } from '@wisemen/api-error'
import type { NatsPipeTransform } from './nats-pipe-transform.js'

export class NatsSubjectParamInvalidUuidError extends BadRequestApiError {
  @ApiErrorCode('nats_subject_param_invalid_uuid')
  code = 'nats_subject_param_invalid_uuid'

  meta: never
}

export class NatsSubjectParamUuidValidationPipe implements NatsPipeTransform {
  transform (value: unknown): unknown {
    if (!isUUID(value)) {
      throw new NatsSubjectParamInvalidUuidError('invalid uuid')
    }

    return value
  }
}
