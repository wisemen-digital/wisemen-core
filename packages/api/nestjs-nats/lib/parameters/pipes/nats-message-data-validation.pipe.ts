import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import type { NatsPipeTransform } from './nats-pipe-transform.js'
import { convertValidationErrorToJsonApiError } from '#src/validation/convert-validation-errors.js'
import type { NatsParameterMetadata } from '#src/parameters/nats-parameter-metadata.js'

export class NatsMsgDataValidationPipe implements NatsPipeTransform {
  async transform (value: unknown, metadata: NatsParameterMetadata): Promise<unknown> {
    if (metadata.metaType === undefined) {
      throw new Error(
        'Could not determine type of parameter.'
        + '\nIs the parameter typed and not imported as a type?'
      )
    }

    const instance = plainToInstance(metadata.metaType, value) as object
    const errors = await validate(instance, { whitelist: true, forbidNonWhitelisted: true })

    if (errors.length > 0) {
      throw convertValidationErrorToJsonApiError(errors)
    }

    return instance
  }
}
