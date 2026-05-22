import type { ClassConstructor } from 'class-transformer'
import { NatsMessageData } from './nats-message-data.decorator.js'
import { NatsMsgDataJsonPipe } from './pipes/nats-message-data-json.pipe.js'
import { NatsMsgDataCloudEventValidationPipe } from './pipes/nats-message-cloud-event-validation.pipe.js'
import { NatsMsgDataValidationPipe } from './pipes/nats-message-data-validation.pipe.js'
import type { NatsMsgDataValidationPipeOptions } from './pipes/nats-message-data-validation.pipe.js'
import type { NatsPipeTransform } from './pipes/nats-pipe-transform.js'

/**
 * Shorthand for `NatsMessageData` pre-configured with:
 *  - `NatsMsgDataJsonPipe` (decode bytes → JSON)
 *  - `NatsMsgDataCloudEventValidationPipe` (validate CloudEvent envelope, extract `.data`)
 *  - `NatsMsgDataValidationPipe` (validate the data against the parameter type)
 *
 * @param options - Options passed to `NatsMsgDataValidationPipe`. `forbidNonWhitelisted` defaults to `false`.
 *
 * Additional pipes can be appended after the options argument.
 */
export function NatsCloudEventData (
  options?: NatsMsgDataValidationPipeOptions,
  ...pipes: (ClassConstructor<NatsPipeTransform> | NatsPipeTransform)[]
): ParameterDecorator {
  return NatsMessageData(
    NatsMsgDataJsonPipe,
    NatsMsgDataCloudEventValidationPipe,
    new NatsMsgDataValidationPipe(options),
    ...pipes
  )
}
