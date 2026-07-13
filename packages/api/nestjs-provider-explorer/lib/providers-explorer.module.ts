import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { ProvidersExplorer } from './providers-explorer.js'

@Module({
  imports: [DiscoveryModule],
  providers: [ProvidersExplorer],
  exports: [ProvidersExplorer]
})
export class ProvidersExplorerModule {}
