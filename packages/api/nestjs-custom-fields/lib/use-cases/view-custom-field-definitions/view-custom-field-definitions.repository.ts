import { Injectable } from '@nestjs/common'
import { IsNull, Repository } from 'typeorm'
import { CustomFieldDefinition } from '#src/typeorm/custom-field-definition.entity.js'
import { ViewCustomFieldDefinitionsQuery } from '#src/use-cases/view-custom-field-definitions/view-custom-field-definitions.query.js'
import { InjectRepository } from '@wisemen/nestjs-typeorm'

@Injectable()
export class ViewCustomFieldDefinitionsRepository {
  constructor(
    @InjectRepository(CustomFieldDefinition)
    private readonly repository: Repository<CustomFieldDefinition>
  ) { }

  async findDefinitions(
    tenantUuid: string | null,
    query: ViewCustomFieldDefinitionsQuery
  ): Promise<CustomFieldDefinition[]> {
    return this.repository.find({
      where: {
        entityType: query.entityType,
        tenantUuid: tenantUuid !== null ? tenantUuid : IsNull()
      },
      order: {
        key: 'ASC'
      }
    })
  }
}
