import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import type { NatsPipeTransform } from './nats-pipe-transform.js'
import { convertValidationErrorToJsonApiError } from '#src/validation/convert-validation-errors.js'
import { CloudEvent } from '#src/cloud-event/cloud-event.js'

/**
 * Validates that the message contains a valid cloud event.
 * The result of this pipe is the data contained in the cloud event.
 */
export class NatsMsgDataCloudEventValidationPipe implements NatsPipeTransform {
  async transform (value: unknown): Promise<unknown> {
    const cloudEvent = plainToInstance(CloudEvent, value)
    const errors = await validate(cloudEvent, { whitelist: true, forbidNonWhitelisted: true })

    if (errors.length > 0) {
      throw convertValidationErrorToJsonApiError(errors)
    }

    return cloudEvent.data
  }
}
