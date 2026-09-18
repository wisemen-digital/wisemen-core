import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { Typesense } from '../index.js'
import { FilterOperator } from '../params-builder/enums/typesense-filter-options.enum.js'
import { createExampleTestContext } from './fixtures/example.test-context.js'

describe('Typesense filters', () => {
  const { users, orders, setup, teardown, search } = createExampleTestContext()

  before(setup)
  after(teardown)

  it('filters with EQUALS on a scalar value', async () => {
    const params = Typesense.createSearchParamsBuilder(users)
      .addFilterOn(users.isActive, FilterOperator.EQUALS, true)
      .build()

    const result = await search(users, params)

    expect(result.found).toBe(2)
  })

  it('filters with EQUALS on an array of values (IN semantics)', async () => {
    const params = Typesense.createSearchParamsBuilder(orders)
      .addFilterOn(orders.status, FilterOperator.EQUALS, ['pending', 'shipped'])
      .build()

    const result = await search(orders, params)

    expect(result.found).toBe(3)
  })

  it('filters with GREATER_THAN_OR_EQUALS on a numeric value', async () => {
    const params = Typesense.createSearchParamsBuilder(users)
      .addFilterOn(users.age, FilterOperator.GREATER_THAN_OR_EQUALS, 30)
      .build()

    const result = await search(users, params)

    expect(result.found).toBe(2)
  })

  it('combines filters with brackets and OR', async () => {
    const params = Typesense.createSearchParamsBuilder(users)
      .addFilterOn(users.isActive, FilterOperator.EQUALS, true)
      .addFilterBrackets(qb => {
        qb.where(users.age, FilterOperator.LESS_THAN, 30)
          .orWhere(users.age, FilterOperator.GREATER_THAN_OR_EQUALS, 40)
      })
      .build()

    const result = await search(users, params)

    expect(result.found).toBe(1)
  })
})
