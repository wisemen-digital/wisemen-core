export { getOtelServiceName } from './get-otel-service-name.js'
export { getOtelTracer } from './get-otel-tracer.js'
export { Trace } from './trace.decorator.js'
export { registerInstrumentation } from './register-instrumentation.js'
export {
  configureOpentelemetryTracing,
  type OpentelemetryTracingConfig,
} from './tracing.js'
export {
  configureOpentelemetryMetrics,
  type OpentelemetryMetricsConfig,
  type OpentelemetryMetricsSdk
} from './metrics.js'
export { type TraceContextCarrier } from './context.js'
export { OpenTelemetryLogger, type LogRecord, type OpentelemetryLoggingConfig } from './logging.js'
export { captureException } from './capture-exception.js'
export { OtelLoggerModule } from './nestjs-logger/otel-logger.module.js'
export { NestjsOtelLogger } from './nestjs-logger/otel-logger.service.js'

export {
  context,
  metrics,
  trace,
  type Attributes,
  type Histogram,
  type MeterProvider,
  type ObservableResult,
  type Sampler,
  SamplingDecision,
  type SamplingResult,
  type Span
} from '@opentelemetry/api'
export { logs, type LoggerProvider } from '@opentelemetry/api-logs'
export { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
export { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto'
export { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
export { resourceFromAttributes } from '@opentelemetry/resources'
export {
  PeriodicExportingMetricReader,
  type Histogram as SdkHistogram,
  MeterProvider as SdkMeterProvider
} from '@opentelemetry/sdk-metrics'
export {
  BatchLogRecordProcessor,
  LoggerProvider as SdkLoggerProvider,
  type LoggerProviderConfig
} from '@opentelemetry/sdk-logs'
export { NodeSDK } from '@opentelemetry/sdk-node'
export {
  BatchSpanProcessor,
  type BufferConfig as TraceBufferConfig,
  SamplingDecision as SdkSamplingDecision,
  type Sampler as SdkSampler,
  type SamplingResult as SdkSamplingResult,
  type Span as SdkSpan
} from '@opentelemetry/sdk-trace-base'
