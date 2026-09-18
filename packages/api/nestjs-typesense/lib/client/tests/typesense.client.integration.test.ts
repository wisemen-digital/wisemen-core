import { randomUUID } from 'node:crypto'
import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { Typesense } from '../../index.js'
import { FilterOperator } from '../../params-builder/enums/typesense-filter-options.enum.js'
import { TYPESENSE_MAX_HITS } from '../../typesense.constant.js'
import { createTestTypesenseClientService } from '../../tests/fixtures/create-test-typesense-client.js'

describe('TypesenseClient', () => {
  const products = Typesense.collection(`products_${randomUUID()}`, {
    id: Typesense.string(),
    name: Typesense.string(),
    status: Typesense.string().facet(),
    price: Typesense.float().sort()
  })

  const client = createTestTypesenseClientService()

  before(async () => {
    await client.client.collections().create(Typesense.collectionSchema(products))

    await client.addDocuments(products, [
      { id: '1', name: 'Keyboard', status: 'in_stock', price: 49.99 },
      { id: '2', name: 'Mouse', status: 'in_stock', price: 19.99 },
      { id: '3', name: 'Monitor', status: 'out_of_stock', price: 199.99 }
    ], Typesense.collectionName(products))
  })

  after(async () => {
    await client.client.collections(Typesense.collectionName(products)).delete()
  })

  it('searches and returns a paginated response', async () => {
    const params = Typesense.createSearchParamsBuilder(products)
      .addFilterOn(products.status, FilterOperator.EQUALS, 'in_stock')
      .build()

    const result = await client.search(products, params)

    expect(result.items).toHaveLength(2)
    expect(result.meta.total).toBe(2)
  })

  it('searches grouped and returns per-group hits', async () => {
    const params = Typesense.createSearchParamsBuilder(products)
      .groupBy(products.status)
      .build()

    const result = await client.searchGrouped(products, params)
    const groupKeys = result.groups.map(group => group.groupKeys).sort()

    expect(groupKeys).toEqual([['in_stock'], ['out_of_stock']])
  })

  it('performs a multi search, keyed by collection name', async () => {
    const response = await client.multiSearch(
      [{ collection: products, q: 'Keyboard', query_by: 'name' }],
      {}
    )

    expect(response[Typesense.collectionName(products)]).toHaveLength(1)
    expect(response[Typesense.collectionName(products)][0].item.name).toBe('Keyboard')
  })

  it('overwrites earlier results under the same key when a collection is queried twice', async () => {
    const response = await client.multiSearch(
      [
        { collection: products, q: 'Keyboard', query_by: 'name' },
        { collection: products, q: 'Mouse', query_by: 'name' }
      ],
      {}
    )

    expect(response[Typesense.collectionName(products)]).toHaveLength(1)
    expect(response[Typesense.collectionName(products)][0].item.name).toBe('Mouse')
  })

  it('rejects a search whose estimated hits exceed the maximum allowed', async () => {
    const params = Typesense.createSearchParamsBuilder(products)
      .withLimit(TYPESENSE_MAX_HITS + 1)
      .build()

    await expect(client.search(products, params)).rejects.toThrow(
      `${TYPESENSE_MAX_HITS + 1} exceeds the maximum allowed hits of ${TYPESENSE_MAX_HITS}.`
    )
  })

  it('deletes documents by id', async () => {
    await client.deleteDocuments(products, ['3'])

    const params = Typesense.createSearchParamsBuilder(products)
      .addFilterOn(products.id, FilterOperator.EQUALS, '3')
      .build()

    const result = await client.search(products, params)

    expect(result.items).toHaveLength(0)
  })

  it('truncates every document from a collection', async () => {
    await client.truncateCollection(products)

    const result = await client.search(products, Typesense.createSearchParamsBuilder(products).build())

    expect(result.items).toHaveLength(0)
  })
})
