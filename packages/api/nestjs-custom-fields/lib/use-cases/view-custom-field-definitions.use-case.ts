import { Injectable } from '@nestjs/common'
import { IsNull, Repository } from 'typeorm'
import { CustomFieldDefinition } from '#src/typeorm/custom-field-definition.entity.js'
import { ViewCustomFieldDefinitionsQuery } from '#src/use-cases/view-custom-field-definitions/view-custom-field-definitions.query.js'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { CustomFieldDefinitionResponse } from '#src/index.js'

@Injectable()
export class ViewCustomFieldDefinitionsUseCase {
  constructor (
    @InjectRepository(CustomFieldDefinition)
    private readonly customFieldDefinitionRepository: Repository<CustomFieldDefinition>
  ) {}

  async execute (
    tenantUuid: string | null,
    query: ViewCustomFieldDefinitionsQuery
  ): Promise<CustomFieldDefinitionResponse[]> {
    const definitions = await this.customFieldDefinitionRepository.find({
      where: {
        entityType: query.entityType,
        tenantUuid: tenantUuid !== null ? tenantUuid : IsNull()
      },
      order: {
        key: 'ASC'
      }
    })

    return definitions.map(definition => CustomFieldDefinitionResponse.from(definition))
  }
}
