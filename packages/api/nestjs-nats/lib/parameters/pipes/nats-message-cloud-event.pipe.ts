import type { NatsPipeTransform } from './nats-pipe-transform.js'
import type { CloudEvent } from '#src/cloud-event/cloud-event.js'

/**
 * Extracts the data field from a cloud event.
 * Does not validate that the message is a valid cloud event — see
 * NatsMsgDataCloudEventValidationPipe.
 */
export class NatsMsgDataCloudEventPipe implements NatsPipeTransform {
  transform (value: CloudEvent): unknown {
    return value.data
  }
}
