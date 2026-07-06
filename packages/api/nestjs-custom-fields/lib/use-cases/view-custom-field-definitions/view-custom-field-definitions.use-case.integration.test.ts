import { after, before, beforeEach, describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '@wisemen/localized-string'
import { dataSource } from '#src/tests/sql/datasource.js'
import { IntegrationTestSetup } from '#src/tests/test-setup.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldDefinition } from '#src/typeorm/custom-field-definition.entity.js'
import { ViewCustomFieldDefinitionsRepository } from './view-custom-field-definitions.repository.js'

describe('ViewCustomFieldDefinitionsUseCase integration', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()
  })

  beforeEach(async () => {
    await integrationTest.clear(CustomFieldDefinition)
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('returns global definitions for the requested entity type ordered by key', async () => {
    const tenantUuid = '00000000-0000-0000-0000-000000000001'

    const referenceDefinition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'ticket',
      key: 'reference',
      label: new LocalizedString([{ locale: 'en', value: 'Reference' }]),
      description: null,
      isRequired: false
    })

    const priorityDefinition = customFieldDefinition(CustomFieldType.MULTI_SELECT, {
      tenantUuid: null,
      entityType: 'ticket',
      key: 'priority',
      label: new LocalizedString([{ locale: 'en', value: 'Priority' }]),
      description: new LocalizedString([{ locale: 'en', value: 'Ticket priority' }]),
      isRequired: true,
      choices: [
        {
          value: 'high',
          label: new LocalizedString([{ locale: 'en', value: 'High' }]),
          order: 2
        },
        {
          value: 'low',
          label: new LocalizedString([{ locale: 'en', value: 'Low' }]),
          order: 1
        }
      ],
      rules: {
        minSelections: 1,
        maxSelections: 2
      }
    })

    const tenantDefinition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid,
      entityType: 'ticket',
      key: 'tenant-only',
      label: new LocalizedString([{ locale: 'en', value: 'Tenant only' }]),
      description: null,
      isRequired: false
    })

    const otherEntityDefinition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'project',
      key: 'project-code',
      label: new LocalizedString([{ locale: 'en', value: 'Project code' }]),
      description: null,
      isRequired: false
    })

    await dataSource.manager.save(CustomFieldDefinition, [
      referenceDefinition,
      priorityDefinition,
      tenantDefinition,
      otherEntityDefinition
    ])

    const useCase = new ViewCustomFieldDefinitionsRepository(
      dataSource.manager.getRepository(CustomFieldDefinition)
    )

    const response = await useCase.findDefinitions({
      entityType: 'ticket'
    })

    expect(response).toHaveLength(2)
    expect(response.map(item => item.key)).toEqual(['priority', 'reference'])
    expect(response).toEqual([
      {
        uuid: priorityDefinition.uuid,
        tenantUuid: null,
        entityType: 'ticket',
        key: 'priority',
        label: [{ locale: 'en', value: 'Priority' }],
        description: [{ locale: 'en', value: 'Ticket priority' }],
        type: CustomFieldType.MULTI_SELECT,
        isRequired: true,
        choices: [
          {
            value: 'high',
            label: [{ locale: 'en', value: 'High' }],
            order: 2
          },
          {
            value: 'low',
            label: [{ locale: 'en', value: 'Low' }],
            order: 1
          }
        ],
        rules: {
          type: CustomFieldType.MULTI_SELECT,
          minSelections: 1,
          maxSelections: 2
        }
      },
      {
        uuid: referenceDefinition.uuid,
        tenantUuid: null,
        entityType: 'ticket',
        key: 'reference',
        label: [{ locale: 'en', value: 'Reference' }],
        description: null,
        type: CustomFieldType.TEXT,
        isRequired: false,
        choices: null,
        rules: null
      }
    ])
  })

  it('returns only definitions for the provided tenant', async () => {
    const tenantUuid = '00000000-0000-0000-0000-000000000010'

    const matchingDefinition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid,
      entityType: 'ticket',
      key: 'alpha',
      label: new LocalizedString([{ locale: 'en', value: 'Alpha' }]),
      description: null,
      isRequired: false
    })

    const secondMatchingDefinition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid,
      entityType: 'ticket',
      key: 'zulu',
      label: new LocalizedString([{ locale: 'en', value: 'Zulu' }]),
      description: null,
      isRequired: false
    })

    const otherTenantDefinition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: '00000000-0000-0000-0000-000000000011',
      entityType: 'ticket',
      key: 'other-tenant',
      label: new LocalizedString([{ locale: 'en', value: 'Other tenant' }]),
      description: null,
      isRequired: false
    })

    const globalDefinition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'ticket',
      key: 'global',
      label: new LocalizedString([{ locale: 'en', value: 'Global' }]),
      description: null,
      isRequired: false
    })

    await dataSource.manager.save(CustomFieldDefinition, [
      matchingDefinition,
      secondMatchingDefinition,
      otherTenantDefinition,
      globalDefinition
    ])

    const useCase = new ViewCustomFieldDefinitionsRepository(
      dataSource.manager.getRepository(CustomFieldDefinition)
    )

    const response = await useCase.findDefinitions({
      tenantUuid,
      entityType: 'ticket'
    })

    expect(response.map(item => item.key)).toEqual(['alpha', 'zulu'])
    expect(response.every(item => item.tenantUuid === tenantUuid)).toBe(true)
  })
})
