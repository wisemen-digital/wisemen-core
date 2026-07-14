import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { ProviderExplorer } from './provider-explorer.js'

@Module({
  imports: [DiscoveryModule],
  providers: [ProviderExplorer],
  exports: [ProviderExplorer]
})
export class ProviderExplorerModule {}
