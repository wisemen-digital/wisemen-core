import { Module } from '@nestjs/common'

/**
 *  Use this module to override the ApiThrottlerModule. 
 *  This disables throttling on the api.
 *  */
@Module({ })
export class TestApiThrottlerModule {}
