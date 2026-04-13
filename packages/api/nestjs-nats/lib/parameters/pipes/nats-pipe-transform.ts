/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import type { NatsParameterMetadata } from '#src/parameters/nats-parameter-metadata.js'

export interface NatsPipeTransform {
  transform(value: unknown, metadata: NatsParameterMetadata): Promise<unknown> | unknown
}
