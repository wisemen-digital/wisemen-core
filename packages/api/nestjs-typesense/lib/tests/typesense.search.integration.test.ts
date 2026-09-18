import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { SortDirection } from '@wisemen/pagination'
import { Typesense, TypesenseMissingValues } from '../index.js'
import { createExampleTestContext } from './fixtures/example.test-context.js'

describe('Typesense search', () => {
  const { users, orders, setup, teardown, search } = createExampleTestContext()

  before(setup)
  after(teardown)

  describe('sorting', () => {
    it('sorts with missing values pushed last', async () => {
      const params = Typesense.createSearchParamsBuilder(users)
        .addSortOn(users.email, SortDirection.ASC, TypesenseMissingValues.LAST)
        .build()

      const result = await search(users, params)
      const ids = result.hits?.map(hit => (hit.document as { id: string }).id)

      expect(ids).toEqual(['user_3', 'user_1', 'user_2'])
    })
  })

  describe('grouping', () => {
    it('groups orders by status', async () => {
      const params = Typesense.createSearchParamsBuilder(orders)
        .groupBy(orders.status)
        .build()

      const result = await search(orders, params)
      const groupKeys = result.grouped_hits?.map(group => group.group_key).sort()

      expect(groupKeys).toEqual([['cancelled'], ['pending'], ['shipped']])
    })
  })

  describe('typo tolerant search', () => {
    it('does not match a typo when numTypos is 0', async () => {
      const params = Typesense.createSearchParamsBuilder(users)
        .withQuery('Johm')
        .addSearchOn(users.name, undefined, 0)
        .build()

      const result = await search(users, params)

      expect(result.found).toBe(0)
    })

    it('matches a typo when numTypos allows it', async () => {
      const params = Typesense.createSearchParamsBuilder(users)
        .withQuery('Johm')
        .addSearchOn(users.name, undefined, 2)
        .build()

      const result = await search(users, params)

      expect(result.found).toBe(1)
    })
  })

  describe('pagination', () => {
    it('paginates results using limit and offset', async () => {
      const firstPage = Typesense.createSearchParamsBuilder(users)
        .addSortOn(users.name, SortDirection.ASC)
        .withLimit(2)
        .withOffset(0)
        .build()

      const secondPage = Typesense.createSearchParamsBuilder(users)
        .addSortOn(users.name, SortDirection.ASC)
        .withLimit(2)
        .withOffset(2)
        .build()

      const firstResult = await search(users, firstPage)
      const secondResult = await search(users, secondPage)

      expect(firstResult.hits).toHaveLength(2)
      expect(secondResult.hits).toHaveLength(1)
    })
  })
})
