import { OnNatsMessage } from './on-nats-message.decorator.js'

export function OnNatsCloudEvent (options: { type: string, version: string }): MethodDecorator {
  return OnNatsMessage({ event: { type: options.type, specversion: options.version } })
}
