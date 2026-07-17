import { ConfigurableModuleBuilder } from '@nestjs/common'
import { OtelLoggerModuleOptions } from './otel-logger.module-options.js'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<OtelLoggerModuleOptions>()
  .setClassMethodName('forRoot')
  .build()
