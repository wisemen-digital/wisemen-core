import { Module } from '@nestjs/common'
import { UserThrottlerContext } from './user-throttler.context.js'

/**
 *  Use this module to override the ApiThrottlerModule. 
 *  This disables throttling on the api.
 *  */
@Module({ 
  providers: [UserThrottlerContext],
  exports: [UserThrottlerContext]
})
export class TestApiThrottlerModule {}
