import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { Typesense } from '../index.js'
import { FilterOperator } from '../params-builder/enums/typesense-filter-options.enum.js'
import { createExampleTestContext } from './fixtures/example.test-context.js'

describe('Typesense joins', () => {
  const { users, orders, userOrders, setup, teardown, search } = createExampleTestContext()

  before(setup)
  after(teardown)

  it('inner joins orders onto their user', async () => {
    const params = Typesense.createSearchParamsBuilder(orders)
      .addFilterOn(orders.id, FilterOperator.EQUALS, 'order_1')
      .innerJoin(orders.userId, {
        select: [users.id, users.name],
        alias: 'user'
      })
      .build()

    const result = await search(orders, params)
    const document = result.hits?.[0]?.document as { user: { name: string } }

    expect(document.user.name).toBe('John Doe')
  })

  it('inner join excludes an order whose user reference does not resolve', async () => {
    const params = Typesense.createSearchParamsBuilder(orders)
      .addFilterOn(orders.id, FilterOperator.EQUALS, 'order_4')
      .innerJoin(orders.userId, {
        select: [users.id]
      })
      .build()

    const result = await search(orders, params)

    expect(result.found).toBe(0)
  })

  it('left join still returns an order whose user reference does not resolve', async () => {
    const params = Typesense.createSearchParamsBuilder(orders)
      .addFilterOn(orders.id, FilterOperator.EQUALS, 'order_4')
      .leftJoin(orders.userId, {
        select: [users.id]
      })
      .build()

    const result = await search(orders, params)

    expect(result.found).toBe(1)
  })

  it('inverse joins matching orders onto a user', async () => {
    const params = Typesense.createSearchParamsBuilder(users)
      .addFilterOn(users.id, FilterOperator.EQUALS, 'user_1')
      .inverseJoin(orders, qb => {
        qb.where(orders.status, FilterOperator.EQUALS, 'shipped')
      }, {
        select: [orders.id, orders.status]
      })
      .build()

    const result = await search(users, params)

    expect(result.found).toBe(1)
  })

  it('joins a pivot collection against two different targets in one query', async () => {
    const params = Typesense.createSearchParamsBuilder(userOrders)
      .addFilterOn(userOrders.id, FilterOperator.EQUALS, 'user_order_1')
      .innerJoin(userOrders.userId, {
        select: [users.name],
        alias: 'user'
      })
      .innerJoin(userOrders.orderId, {
        select: [orders.status],
        alias: 'order'
      })
      .build()

    const result = await search(userOrders, params)
    const document = result.hits?.[0]?.document as { user: { name: string }, order: { status: string } }

    expect(document.user.name).toBe('John Doe')
    expect(document.order.status).toBe('shipped')
  })
})
