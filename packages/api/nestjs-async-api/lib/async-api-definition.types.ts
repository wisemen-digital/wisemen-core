import { AsyncAPIInfo, AsyncAPIOperation, AsyncAPIParameter } from './async-api.types.js'

export type AsyncApiMessageClass = (new (...arguments_: never[]) => object) & { name: string }

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
    & { messages?: AsyncApiMessageClass[] }

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
