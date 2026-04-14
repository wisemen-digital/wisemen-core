import { ConfigurableModuleBuilder } from '@nestjs/common'
import { RedisModuleOptions } from './redis.module-options.js'

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<RedisModuleOptions>()
  .setClassMethodName('forRoot')
  .build()
