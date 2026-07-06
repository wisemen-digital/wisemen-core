import { describe, it } from 'node:test'
import { expect } from 'expect'
import { LocalizedString } from '@wisemen/localized-string'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { customFieldDefinition } from '#src/factory/custom-field-definition.factory.js'
import { CustomFieldDefinitionResponse } from '#src/responses/custom-field-definition.response.js'

describe('CustomFieldDefinitionResponse', () => {
  it('maps a persisted custom field definition to an api response', () => {
    const definition = customFieldDefinition(CustomFieldType.MULTI_SELECT, {
      tenantUuid: crypto.randomUUID(),
      entityType: 'ticket',
      key: 'priority',
      label: new LocalizedString([
        { locale: 'en', value: 'Priority' },
        { locale: 'nl', value: 'Prioriteit' }
      ]),
      description: new LocalizedString([
        { locale: 'en', value: 'How urgent the ticket is' }
      ]),
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

    const response = CustomFieldDefinitionResponse.from(definition)

    expect(response).toEqual({
      uuid: definition.uuid,
      tenantUuid: definition.tenantUuid,
      entityType: 'ticket',
      key: 'priority',
      label: [
        { locale: 'en', value: 'Priority' },
        { locale: 'nl', value: 'Prioriteit' }
      ],
      description: [
        { locale: 'en', value: 'How urgent the ticket is' }
      ],
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
    })
  })

  it('returns null when mapping a null definition', () => {
    expect(CustomFieldDefinitionResponse.from(null)).toBeNull()
  })

  it('maps nullable fields to null', () => {
    const definition = customFieldDefinition(CustomFieldType.TEXT, {
      tenantUuid: null,
      entityType: 'order',
      key: 'reference',
      label: new LocalizedString([{ locale: 'en', value: 'Reference' }]),
      description: null,
      isRequired: false
    })

    const response = new CustomFieldDefinitionResponse(definition)

    expect(response.description).toBeNull()
    expect(response.tenantUuid).toBeNull()
    expect(response.choices).toBeNull()
    expect(response.rules).toBeNull()
  })
})
