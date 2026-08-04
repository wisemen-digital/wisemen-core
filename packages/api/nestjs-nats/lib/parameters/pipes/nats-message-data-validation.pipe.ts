import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { convertClassValidatorErrorsToJsonApiError } from '@wisemen/api-error'
import type { NatsPipeTransform } from './nats-pipe-transform.js'
import type { NatsParameterMetadata } from '#src/parameters/nats-parameter-metadata.js'

export interface NatsMsgDataValidationPipeOptions {
  forbidNonWhitelisted?: boolean
}

export class NatsMsgDataValidationPipe implements NatsPipeTransform {
  private readonly forbidNonWhitelisted: boolean

  constructor (options: NatsMsgDataValidationPipeOptions = {}) {
    this.forbidNonWhitelisted = options.forbidNonWhitelisted ?? false
  }

  async transform (value: unknown, metadata: NatsParameterMetadata): Promise<unknown> {
    if (metadata.metaType === undefined) {
      throw new Error(
        'Could not determine type of parameter.'
        + '\nIs the parameter typed and not imported as a type?'
      )
    }

    const instance = plainToInstance(metadata.metaType, value) as object
    const errors = await validate(instance, { whitelist: true, forbidNonWhitelisted: this.forbidNonWhitelisted })

    if (errors.length > 0) {
      throw convertClassValidatorErrorsToJsonApiError(errors)
    }

    return instance
  }
}
