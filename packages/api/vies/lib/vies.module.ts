import { Module } from '@nestjs/common'
import { ViesClient } from './client/vies.client.js'

@Module({
  providers: [ViesClient],
  exports: [ViesClient]
})
export class ViesModule {}
