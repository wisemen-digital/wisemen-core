import { randomUUID } from 'node:crypto'
import type { SearchParams } from 'typesense'
import { Typesense } from '../../index.js'
import { createTestTypesenseClient } from './create-test-typesense-client.js'
import {
  createExampleCollections,
  exampleOrdersSeed,
  exampleUserOrdersSeed,
  exampleUsersSeed,
  type ExampleCollections
} from './example-collections.fixture.js'

export function createExampleTestContext () {
  const client = createTestTypesenseClient()

  const { users, orders, userOrders } = createExampleCollections(randomUUID())

  async function setup (): Promise<void> {
    for (const collection of [users, orders, userOrders]) {
      await client.collections().create(Typesense.collectionSchema(collection))
    }

    await client.collections(Typesense.collectionName(users)).documents()
      .import(exampleUsersSeed(), { action: 'upsert' })
    await client.collections(Typesense.collectionName(orders)).documents()
      .import(exampleOrdersSeed(), { action: 'upsert' })
    await client.collections(Typesense.collectionName(userOrders)).documents()
      .import(exampleUserOrdersSeed(), { action: 'upsert' })
  }

  async function teardown (): Promise<void> {
    for (const collection of [users, orders, userOrders]) {
      await client.collections(Typesense.collectionName(collection)).delete()
    }
  }

  async function search (
    collection: ExampleCollections['users'] | ExampleCollections['orders'] | ExampleCollections['userOrders'],
    params: object
  ) {
    return client
      .collections(Typesense.collectionName(collection))
      .documents()
      .search(params as SearchParams<object>)
  }

  return {
    client, users, orders, userOrders, setup, teardown, search
  }
}
