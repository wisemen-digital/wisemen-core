import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { CustomFieldDefinition } from '#src/typeorm/custom-field-definition.entity.js'
import { InjectRepository } from '@wisemen/nestjs-typeorm'

export interface CustomFieldDefinitionsOptions {
  tenantUuid?: string
  entityType?: string
}

@Injectable()
export class CustomFieldDefinitionsRepository {
  constructor(
    @InjectRepository(CustomFieldDefinition)
    private readonly repository: Repository<CustomFieldDefinition>
  ) { }

  async findDefinitions(
    options? : CustomFieldDefinitionsOptions
  ): Promise<CustomFieldDefinition[]> {
    return this.repository.find({
      where: {
        entityType: options?.entityType,
        tenantUuid: options?.tenantUuid
      },
      order: {
        key: 'ASC'
      }
    })
  }
}
