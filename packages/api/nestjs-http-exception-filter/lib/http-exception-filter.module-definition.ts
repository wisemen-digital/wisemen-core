import { ConfigurableModuleBuilder } from '@nestjs/common'
import type { HttpExceptionFilterModuleOptions } from './http-exception-filter.module-options.js'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<HttpExceptionFilterModuleOptions>()
  .setClassMethodName('forRoot')
  .build()
