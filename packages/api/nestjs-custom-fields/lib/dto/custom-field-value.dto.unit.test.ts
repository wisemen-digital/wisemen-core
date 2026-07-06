import { describe, it } from 'node:test'
import { expect } from 'expect'
import { validate } from 'class-validator'
import { DateTimeCustomFieldValueDto } from '#src/dto/custom-field-value.dto.js'
import { generateUuid } from '#src/custom-field-definition.uuid.js'

describe('DateTimeCustomFieldValueDto', () => {
  it('rejects a timestamp value without an explicit timezone', async () => {
    const dto = new DateTimeCustomFieldValueDto()

    dto.definitionUuid = generateUuid()
    dto.value = '2026-01-01T12:00:00'

    const errors = await validate(dto)

    expect(errors.map(error => error.property)).toContain('value')
  })

  it('accepts a timestamp value with a Z timezone', async () => {
    const dto = new DateTimeCustomFieldValueDto()

    dto.definitionUuid = generateUuid()
    dto.value = '2026-01-01T12:00:00.000Z'

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })
})
