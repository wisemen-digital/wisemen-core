import { Module } from '@nestjs/common'
import { ProvidersExplorer } from './providers-explorer.js'

@Module({
  providers: [ProvidersExplorer],
  exports: [ProvidersExplorer]
})
export class ProvidersExplorerModule {}
