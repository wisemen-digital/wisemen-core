import { describe, it } from 'node:test'
import { expect } from 'expect'
import { validate } from 'class-validator'
import { plainDate, timestamp } from '@wisemen/datewise'
import { Currency, Monetary } from '@wisemen/monetary'
import type { BaseCustomFieldValueDto } from '#src/dto/base-custom-field-value.dto.js'
import type { CustomFieldDefinitionUuid } from '#src/custom-field-definition.uuid.js'
import { BooleanCustomFieldValueDto, CUSTOM_FIELD_VALUE_DTOS, CustomFieldValueDto, DateCustomFieldValueDto, MonetaryCustomFieldValueDto, MultiSelectCustomFieldValueDto, NumberCustomFieldValueDto, SingleSelectCustomFieldValueDto, TextArrayCustomFieldValueDto, TextCustomFieldValueDto, TimestampCustomFieldValueDto } from '#src/dto/custom-field-value.dto.js'
import { generateUuid } from '#src/custom-field-definition.uuid.js'
import { CustomFieldType } from '#src/enum/custom-field-type.enum.js'
import type { CustomFieldValue } from '#src/custom-field-value.js'

describe('TimestampCustomFieldValueDto', () => {
  it('rejects a timestamp value without an explicit timezone', async () => {
    const dto = new TimestampCustomFieldValueDto()

    dto.definitionUuid = generateUuid()
    dto.value = '2026-01-01T12:00:00'

    const errors = await validate(dto)

    expect(errors.map(error => error.property)).toContain('value')
  })

  it('accepts a timestamp value with a Z timezone', async () => {
    const dto = new TimestampCustomFieldValueDto()

    dto.definitionUuid = generateUuid()
    dto.value = '2026-01-01T12:00:00.000Z'

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })
})

describe('CustomFieldValueDto', () => {
  it('registers a dto for every custom field type', () => {
    expect(CUSTOM_FIELD_VALUE_DTOS).toHaveLength(Object.values(CustomFieldType).length)
  })

  it('maps every custom field value to its dto class', () => {
    const definitionUuid = generateUuid<CustomFieldDefinitionUuid>()

    const testCases: Array<{ input: CustomFieldValue, expectedClass: new () => BaseCustomFieldValueDto }> = [
      {
        input: { definitionUuid, type: CustomFieldType.TEXT, value: 'notes' },
        expectedClass: TextCustomFieldValueDto
      },
      {
        input: { definitionUuid, type: CustomFieldType.TEXT_ARRAY, value: ['a', 'b'] },
        expectedClass: TextArrayCustomFieldValueDto
      },
      {
        input: { definitionUuid, type: CustomFieldType.NUMBER, value: 42 },
        expectedClass: NumberCustomFieldValueDto
      },
      {
        input: { definitionUuid, type: CustomFieldType.BOOLEAN, value: true },
        expectedClass: BooleanCustomFieldValueDto
      },
      {
        input: { definitionUuid, type: CustomFieldType.DATE, value: plainDate('2026-01-01') },
        expectedClass: DateCustomFieldValueDto
      },
      {
        input: { definitionUuid, type: CustomFieldType.TIMESTAMP, value: timestamp('2026-01-01T12:00:00.000Z') },
        expectedClass: TimestampCustomFieldValueDto
      },
      {
        input: { definitionUuid, type: CustomFieldType.SINGLE_SELECT, value: 'primary' },
        expectedClass: SingleSelectCustomFieldValueDto
      },
      {
        input: { definitionUuid, type: CustomFieldType.MULTI_SELECT, value: ['primary'] },
        expectedClass: MultiSelectCustomFieldValueDto
      },
      {
        input: { definitionUuid, type: CustomFieldType.MONETARY, value: new Monetary(100, Currency.EUR, 2) },
        expectedClass: MonetaryCustomFieldValueDto
      }
    ]

    for (const testCase of testCases) {
      expect(CustomFieldValueDto.from(testCase.input)).toBeInstanceOf(testCase.expectedClass)
    }
  })
})
