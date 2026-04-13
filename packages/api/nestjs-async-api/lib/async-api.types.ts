// AsyncAPI v3.0.0 Document Format as TypeScript Types
// Reference: https://www.asyncapi.com/docs/reference/specification/v3.0.0

export type AsyncApiRef = {
  $ref: string
}

export type AsyncAPIDocument = {
  asyncapi: string
  id?: string
  info: AsyncAPIInfo
  servers?: Record<string, AsyncAPIServer>
  defaultContentType?: string
  channels: Record<string, AsyncAPIChannel>
  operations?: Record<string, AsyncAPIOperation>
  components?: AsyncAPIComponents
  tags?: AsyncAPITag[]
  externalDocs?: AsyncAPIExternalDocs
}

export type AsyncAPIInfo = {
  title: string
  version: string
  description?: string
  termsOfService?: string
  contact?: AsyncAPIContact
  license?: AsyncAPILicense
}

export type AsyncAPIContact = {
  name?: string
  url?: string
  email?: string
}

export type AsyncAPILicense = {
  name: string
  url?: string
}

export type AsyncAPIServer = {
  host: string
  protocol: string
  protocolVersion?: string
  description?: string
  tags?: AsyncAPITag[]
  security?: AsyncAPISecurityRequirement[]
  variables?: Record<string, AsyncAPIServerVariable>
  bindings?: AsyncAPIServerBindings
}

export type AsyncAPIServerVariable = {
  description?: string
  default: string
  examples?: string[]
  enum?: string[]
}

export type AsyncAPISecurityRequirement = Record<string, string[]>

export type AsyncAPIServerBindings = Record<string, unknown>

export type AsyncAPIChannel = {
  address: string
  description?: string
  parameters?: Record<string, AsyncAPIParameter>
  messages?: Record<string, AsyncApiRef>
  subscribe?: string // Operation ID
  publish?: string // Operation ID
  bindings?: AsyncAPIChannelBindings
}

export type AsyncAPIChannelBindings = Record<string, unknown>

export type AsyncAPIParameter = {
  enum?: string[]
  default?: string
  description?: string
  examples?: string[]
  location?: string
}

export type AsyncAPIOperation = {
  action: 'send' | 'receive'
  channel: AsyncApiRef
  title?: string
  summary?: string
  description?: string
  tags?: AsyncAPITag[]
  externalDocs?: AsyncAPIExternalDocs
  bindings?: AsyncAPIOperationBindings
  traits?: (string | AsyncAPIOperationTrait)[]
  messages?: AsyncApiRef[]
  security?: AsyncAPISecurityRequirement[]
  deprecated?: boolean
  reply?: AsyncAPIOperationReply
}

export type AsyncAPIOperationReply = {
  address?: AsyncAPIOperationReplyAddress
  channel?: AsyncApiRef
  messages?: AsyncApiRef
}

export type AsyncAPIOperationReplyAddress = {
  location: string
  description?: string
}

export type AsyncAPIOperationTrait = Record<string, unknown>
export type AsyncAPIOperationBindings = Record<string, unknown>

export type AsyncAPIMessage = {
  name?: string
  title?: string
  summary?: string
  description?: string
  headers?: AsyncAPISchema
  payload?: AsyncApiRef
  correlationId?: AsyncAPICorrelationId
  schemaFormat?: string
  contentType?: string
  tags?: AsyncAPITag[]
  externalDocs?: AsyncAPIExternalDocs
  bindings?: AsyncAPIMessageBindings
  examples?: unknown[]
  traits?: (string | AsyncAPIMessageTrait)[]
}

export type AsyncAPIMessageTrait = Record<string, unknown>
export type AsyncAPIMessageBindings = Record<string, unknown>

export type AsyncAPICorrelationId = {
  description?: string
  location: string
}

export type AsyncAPISchema = Record<string, unknown>

export type AsyncAPIComponents = {
  schemas?: Record<string, AsyncAPISchema>
  messages?: Record<string, AsyncAPIMessage>
  securitySchemes?: Record<string, AsyncAPISecurityScheme>
  parameters?: Record<string, AsyncAPIParameter>
  correlationIds?: Record<string, AsyncAPICorrelationId>
  operationTraits?: Record<string, AsyncAPIOperationTrait>
  messageTraits?: Record<string, AsyncAPIMessageTrait>
  serverBindings?: Record<string, AsyncAPIServerBindings>
  channelBindings?: Record<string, AsyncAPIChannelBindings>
  operationBindings?: Record<string, AsyncAPIOperationBindings>
  messageBindings?: Record<string, AsyncAPIMessageBindings>
}

export type AsyncAPISecurityScheme = {
  type: string
  description?: string
  name?: string
  in?: string
  scheme?: string
  bearerFormat?: string
  flows?: unknown
  openIdConnectUrl?: string
}

export type AsyncAPITag = {
  name: string
  description?: string
  externalDocs?: AsyncAPIExternalDocs
}

export type AsyncAPIExternalDocs = {
  description?: string
  url: string
}
