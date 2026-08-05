import { Module } from '@nestjs/common'
import { ProviderExplorerModule } from '@wisemen/nestjs-provider-explorer'
import { TypesenseCollectors } from './typesense-collectors.js'

@Module({
  imports: [ProviderExplorerModule],
  providers: [TypesenseCollectors],
  exports: [TypesenseCollectors]
})
export class TypesenseCollectorsModule {}
