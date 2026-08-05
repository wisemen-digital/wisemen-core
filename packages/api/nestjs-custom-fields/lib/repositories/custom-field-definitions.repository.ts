import { Injectable } from '@nestjs/common'
import { Any, Repository } from 'typeorm'
import { CustomFieldDefinition } from '#src/typeorm/custom-field-definition.entity.js'
import { InjectRepository } from '@wisemen/nestjs-typeorm'

export interface CustomFieldDefinitionsOptions {
  tenantUuid?: string
  entityType?: string | string[]
}

@Injectable()
export class CustomFieldDefinitionsRepository {
  constructor(
    @InjectRepository(CustomFieldDefinition)
    private readonly repository: Repository<CustomFieldDefinition>
  ) { }

  async findDefinitions(
    options?: CustomFieldDefinitionsOptions
  ): Promise<CustomFieldDefinition[]> {
    const entityType = options?.entityType
    const isArray = Array.isArray(entityType)
    if (isArray && entityType.length === 0) {
      return []
    }

    return this.repository.find({
      where: {
        entityType: isArray ? Any(entityType) : entityType,
        tenantUuid: options?.tenantUuid
      },
      order: {
        key: 'ASC'
      }
    })
  }
}
