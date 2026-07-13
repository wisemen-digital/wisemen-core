import { Module } from '@nestjs/common'
import { ProvidersExplorerModule } from '@wisemen/nestjs-provider-explorer'
import { TypesenseCollectors } from './typesense-collectors.js'

@Module({
  imports: [ProvidersExplorerModule],
  providers: [TypesenseCollectors],
  exports: [TypesenseCollectors]
})
export class TypesenseCollectorsModule {}
