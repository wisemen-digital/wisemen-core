import { describe, it } from 'node:test'
import { expect } from 'expect'
import type { CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import { generateUuid } from '#src/custom-field-definition.uuid.js'
import { customFieldValue } from '#src/factory/custom-field-value.factory.js'

describe('customFieldValue', () => {
  it('creates a typed custom field value', () => {
    const definitionUuid = generateUuid<CustomFieldDefinitionUuid>()

    expect(customFieldValue(CustomFieldType.TEXT, definitionUuid, 'hello')).toEqual({
      definitionUuid,
      type: CustomFieldType.TEXT,
      value: 'hello'
    })
  })

  it('supports values whose runtime shape depends on the field type', () => {
    const definitionUuid = generateUuid<CustomFieldDefinitionUuid>()

    expect(customFieldValue(CustomFieldType.MULTI_SELECT, definitionUuid, ['low', 'high'])).toEqual({
      definitionUuid,
      type: CustomFieldType.MULTI_SELECT,
      value: ['low', 'high']
    })
  })
})
