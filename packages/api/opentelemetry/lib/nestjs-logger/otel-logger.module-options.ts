import { LogLevel } from "@nestjs/common";
import { OpentelemetryLoggingConfig } from "../logging.js";

/**
 * Options for configuring the otel logger module.
 */
export interface OtelLoggerModuleOptions extends OpentelemetryLoggingConfig {
  logLevels?: LogLevel[]
}
