import { DateRangeDto, DateTimeRangeDto } from '@wisemen/datewise'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { describe, it } from 'node:test'
import { DateFilterCondition } from '#src/date-filter-condition.js'
import { DateRangeFilter } from '#src/date-range-filter.js'
import { DateTimeRangeFilter } from '#src/date-time-range-filter.js'
import { NumberFilterCondition } from '#src/number-filter-condition.js'
import { NumberFilter } from '#src/number-filter.js'
import { PlainDateFilter } from '#src/plain-date-filter.js'
import { RangeFilterCondition } from '#src/range-filter-condition.js'
import { TimestampFilter } from '#src/timestamp-filter.js'

describe('conditional filters', () => {
  it('validates number filters', async () => {
    const validFilter = new NumberFilter(NumberFilterCondition.GREATER_THAN_OR_EQUAL, 10)
    const invalidFilter = new NumberFilter('wat' as NumberFilterCondition, '10' as unknown as number)

    expect(await validate(validFilter)).toHaveLength(0)
    expect(await validate(invalidFilter)).toHaveLength(2)
  })

  it('validates timestamp and plain date filters', async () => {
    const validTimestampFilter = new TimestampFilter(DateFilterCondition.AFTER, '2025-01-01T10:00:00.000Z')
    const invalidTimestampFilter = new TimestampFilter(DateFilterCondition.AFTER, 'not-a-date')
    const validPlainDateFilter = new PlainDateFilter(DateFilterCondition.BEFORE, '2025-01-01')
    const invalidPlainDateFilter = new PlainDateFilter(DateFilterCondition.BEFORE, '2025-99-99')

    expect(await validate(validTimestampFilter)).toHaveLength(0)
    expect(await validate(invalidTimestampFilter)).toHaveLength(1)
    expect(await validate(validPlainDateFilter)).toHaveLength(0)
    expect(await validate(invalidPlainDateFilter)).toHaveLength(1)
  })

  it('validates date range filters', async () => {
    const validDateRangeValue = new DateRangeDto()
    validDateRangeValue.startDate = '2025-01-01'
    validDateRangeValue.endDate = '2025-01-10'

    const invalidDateRangeValue = new DateRangeDto()
    invalidDateRangeValue.startDate = '2025-01-10'
    invalidDateRangeValue.endDate = '2025-01-01'

    const validDateTimeRangeValue = new DateTimeRangeDto()
    validDateTimeRangeValue.from = '2025-01-01T00:00:00.000Z'
    validDateTimeRangeValue.until = '2025-01-10T00:00:00.000Z'

    const invalidDateTimeRangeValue = new DateTimeRangeDto()
    invalidDateTimeRangeValue.from = '2025-01-10T00:00:00.000Z'
    invalidDateTimeRangeValue.until = '2025-01-01T00:00:00.000Z'

    const validDateRangeFilter = new DateRangeFilter(RangeFilterCondition.OVERLAPS, validDateRangeValue)
    const invalidDateRangeFilter = new DateRangeFilter(RangeFilterCondition.OVERLAPS, invalidDateRangeValue)
    const validDateTimeRangeFilter = new DateTimeRangeFilter(RangeFilterCondition.CONTAINS, validDateTimeRangeValue)
    const invalidDateTimeRangeFilter = new DateTimeRangeFilter(RangeFilterCondition.CONTAINS, invalidDateTimeRangeValue)

    expect(await validate(validDateRangeFilter)).toHaveLength(0)
    expect(await validate(invalidDateRangeFilter)).toHaveLength(1)
    expect(await validate(validDateTimeRangeFilter)).toHaveLength(0)
    expect(await validate(invalidDateTimeRangeFilter)).toHaveLength(1)
  })
})
