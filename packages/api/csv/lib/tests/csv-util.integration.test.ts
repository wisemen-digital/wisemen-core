import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DataSource } from 'typeorm'
import { CSV } from '../csv.util.js'
import { CsvEncodeStreamTest } from './sql/csv-encode-stream-test.entity.js'
import { dataSource } from './sql/datasource.js'
import { IntegrationTestSetup } from './test-setup.js'

describe('CSV util integration', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('encodes query-builder results returned through manager.query()', async () => {
    await seed(dataSource, {
      id: 1,
      name: 'Smith;Jones',
      age: 30,
      note: 'says "hello"'
    })

    await seed(dataSource, {
      id: 2,
      name: 'Jane Doe',
      age: 25,
      note: 'line1\nline2'
    })

    const queryBuilder = dataSource.manager
      .createQueryBuilder(CsvEncodeStreamTest, 'row')
      .select([
        'row.name AS name',
        'row.age::text AS age',
        'row.note AS note',
      ])
      .where('row.id IN (:...ids)', { ids: [1, 2] })
      .orderBy('row.id', 'ASC')

    const entityStream = await queryBuilder.stream()

    const stream = CSV.encodeStream(entityStream, {
      columns: ['name', 'age', 'note'],
      batchSize: 1,
      maxChunkBytes: Number.MAX_SAFE_INTEGER
    })

    let rawText = ''
    for await (const chunk of stream) {
      rawText += String(chunk)
    }

    expect(rawText).toBe([
      'name;age;note',
      '"Smith;Jones";30;"says ""hello"""',
      'Jane Doe;25;"line1\nline2"',
      ''
    ].join('\n'))
  })

  async function seed (source: DataSource, row: CsvEncodeStreamTest): Promise<void> {
    await source.manager.upsert(CsvEncodeStreamTest, row, { conflictPaths: { id: true } })
  }
})
