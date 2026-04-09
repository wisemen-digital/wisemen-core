import { Module } from '@nestjs/common'
import { RedisClient } from './redis.client.js'
import {
  ConfigurableModuleClass
} from './redis.module-definitions.js'

@Module({
  providers: [RedisClient],
  exports: [RedisClient]
})
export class RedisModule extends ConfigurableModuleClass {}
