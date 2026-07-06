import { CustomFieldDefinition } from '#src/typeorm/custom-field-definition.entity.js'
import { ViewCustomFieldDefinitionsUseCase } from '#src/use-cases/view-custom-field-definitions/view-custom-field-definitions.use-case.js'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomFieldDefinition])
  ],
  providers: [
    ViewCustomFieldDefinitionsUseCase,
  ],
  exports: [
    ViewCustomFieldDefinitionsUseCase
  ]
})
export class ViewCustomFieldDefinitionsModule {}
