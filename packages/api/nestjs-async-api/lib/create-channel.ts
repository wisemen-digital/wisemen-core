import { AsyncAPIChannelDefinition } from './async-api-definition.types.js'

const CHANNEL_METADATA_KEY = 'async-api:channel'

export type ChannelConfig<Address extends string>
  = Omit<AsyncAPIChannelDefinition<Address>, 'address'>

export function isChannel (value: object): value is AsyncAPIChannelDefinition<string> {
  return Reflect.hasMetadata(CHANNEL_METADATA_KEY, value)
}

export function createChannel<Address extends string> (
  address: Address,
  config: ChannelConfig<Address>
): AsyncAPIChannelDefinition<Address> {
  const channel = { address, ...config }

  Reflect.defineMetadata(CHANNEL_METADATA_KEY, true, channel)

  return channel
}
