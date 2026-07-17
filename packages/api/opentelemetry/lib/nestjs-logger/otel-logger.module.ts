import { Module } from '@nestjs/common'
import { NestjsOtelLogger } from './otel-logger.service.js';
import { ConfigurableModuleClass } from './otel-logger.module-definitions.js';

@Module({
  providers: [NestjsOtelLogger],
  exports: [NestjsOtelLogger]
})
export class OtelLoggerModule extends ConfigurableModuleClass {}
