import type {
  Attributes,
  AttributeValue,
} from '@opentelemetry/api'

export type TelemetryAttributes = Attributes
export type TelemetryAttributeValue = AttributeValue
export type TelemetrySeverity
  = 'debug'
    | 'error'
    | 'fatal'
    | 'info'
    | 'warn'

export interface TelemetryUser {
  id?: string
  email?: string
}

export interface TelemetryLogOptions {
  attributes?: TelemetryAttributes
  eventName?: string
  severity?: TelemetrySeverity
}

export interface TelemetryOptions {
  accessTokenFn: () => Promise<string>
  buildNumber?: string
  buildTimestamp?: string
  commitHash?: string
  debug?: boolean
  enabled?: boolean
  environment?: string
  logEndpoint?: string
  metricsEndpoint?: string
  serviceName: string
  serviceVersion?: string
  traceEndpoint?: string
}
