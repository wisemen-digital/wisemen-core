import { CustomFieldDefinitionsRepository } from '#src/repositories/custom-field-definitions.repository.js'
import { CustomFieldDefinition } from '#src/typeorm/custom-field-definition.entity.js'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@wisemen/nestjs-typeorm'

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomFieldDefinition])
  ],
  providers: [
    CustomFieldDefinitionsRepository,
  ],
  exports: [
    CustomFieldDefinitionsRepository
  ]
})
export class CustomFieldDefinitionRepositoryModule {}
