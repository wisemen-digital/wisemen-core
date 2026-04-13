export interface SentryOptions {
  /**
   * debug: If true, enables debug mode for Sentry.
   * Default is false.
   */
  debug?: boolean
  /**
   * dsn: The Data Source Name for Sentry, which is required for initialization.
   * This is the endpoint where Sentry will send error reports.
   */
  dsn: string
  /**
   * enabled: If true, enables Sentry error reporting.
   * Default is true.
   */
  enabled?: boolean
  /**
   * enableReplays: If true, enables session replay functionality.
   * Default is false.
   */
  enableReplays?: boolean
  /**
   * environment: The environment in which the application is running (e.g., 'production', 'development').
   * Default is 'production'.
   */
  environment?: string
  /**
   * replaysOnErrorSampleRate: The sample rate for session replays when an error occurs.
   * Default is 1.0 (100%).
   */
  replaysOnErrorSampleRate?: number
  /**
   * replaysSessionSampleRate: The sample rate for session replays.
   * Default is 0.1 (10%).
   */
  replaysSessionSampleRate?: number
  /**
   * sampleRate: The sample rate for capturing events.
   * Default is 1.0 (100%).
   */
  sampleRate?: number
}

export interface OpenTelemetryOptions {
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

export interface TelemetryOptions {
  openTelemetry?: OpenTelemetryOptions
  sentry?: SentryOptions
}
