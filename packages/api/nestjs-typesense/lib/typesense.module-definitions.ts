import { ConfigurableModuleBuilder } from '@nestjs/common'
import { TypesenseModuleOptions } from './typesense.module-options.js'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<TypesenseModuleOptions>()
  .setClassMethodName('forRoot')
  .build()
