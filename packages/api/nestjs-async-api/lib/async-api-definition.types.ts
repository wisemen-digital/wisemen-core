import { AsyncAPIInfo, AsyncAPIOperation, AsyncAPIParameter } from './async-api.types.js'

type ExtractParams<T>
  = T extends `{${infer Param}}.${infer Rest}`
    ? { [K in Param]: string } & ExtractParams<Rest>
    : T extends `${infer _Start}.{${infer Param}}${infer Rest}`
      ? { [K in Param]: string } & ExtractParams<Rest>
      : object

export type AsyncAPIChannelParameters<Address> = {
  [Param in keyof ExtractParams<Address>]: AsyncAPIParameter
}

export type AsyncAPIOperationDefinition
  = Omit<AsyncAPIOperation, 'messages' | 'channel' | 'reply'>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    & { messages?: Function[] }

export type AsyncAPIChannelDefinition<Address extends string> = {
  address: Address
  parameters: AsyncAPIChannelParameters<Address>
  operations?: Record<string, AsyncAPIOperationDefinition>
}

export type AsyncAPIDefinition = {
  asyncapi: string
  defaultContentType: string
  info: AsyncAPIInfo
  channels: string
}
