import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parse } from 'pgsql-ast-parser'
import { SqlQuerySummarizer } from '../sql-query-summarizer.js'

describe('SqlQuerySummarizer', () => {
  it('summarizes common TypeORM query shapes without values, columns, or aliases', () => {
    const summarizer = new SqlQuerySummarizer()

    assert.deepEqual(
      summarizer.summarize(`
        SELECT payment.uuid
        FROM payment payment
        INNER JOIN order_item item ON item.payment_uuid = payment.uuid
        WHERE payment.uuid = $1
      `),
      {
        operation: 'SELECT',
        summary: 'SELECT payment order_item'
      }
    )
    assert.deepEqual(
      summarizer.summarize('INSERT INTO payment (uuid) VALUES ($1) RETURNING uuid'),
      {
        collection: 'payment',
        operation: 'INSERT',
        summary: 'INSERT payment'
      }
    )
    assert.deepEqual(
      summarizer.summarize('UPDATE payment SET status = $1 WHERE uuid = $2'),
      {
        collection: 'payment',
        operation: 'UPDATE',
        summary: 'UPDATE payment'
      }
    )
    assert.deepEqual(
      summarizer.summarize('DELETE FROM payment WHERE uuid = $1'),
      {
        collection: 'payment',
        operation: 'DELETE',
        summary: 'DELETE payment'
      }
    )
  })

  it('preserves operation and relation order for compound queries', () => {
    const summarizer = new SqlQuerySummarizer()

    assert.deepEqual(
      summarizer.summarize('INSERT INTO payment_archive (uuid) SELECT uuid FROM payment'),
      {
        operation: 'INSERT',
        summary: 'INSERT payment_archive SELECT payment'
      }
    )
    assert.deepEqual(
      summarizer.summarize(`
        WITH recent AS (SELECT * FROM payment)
        SELECT * FROM recent
      `),
      {
        operation: 'SELECT',
        summary: 'SELECT payment SELECT recent'
      }
    )
    assert.deepEqual(
      summarizer.summarize(`
        SELECT *
        FROM (SELECT * FROM orders JOIN customer ON customer.id = orders.customer_id) nested
      `),
      {
        operation: 'SELECT',
        summary: 'SELECT SELECT orders customer'
      }
    )
  })

  it('quotes relation identifiers when needed and sets a single collection', () => {
    const summarizer = new SqlQuerySummarizer()

    assert.deepEqual(
      summarizer.summarize('SELECT * FROM public."payment history"'),
      {
        collection: 'public."payment history"',
        operation: 'SELECT',
        summary: 'SELECT public."payment history"'
      }
    )
  })

  it('summarizes transaction statements and batches', () => {
    const summarizer = new SqlQuerySummarizer()

    assert.deepEqual(summarizer.summarize('START TRANSACTION'), {
      operation: 'START',
      summary: 'START'
    })
    assert.deepEqual(summarizer.summarize('COMMIT'), {
      operation: 'COMMIT',
      summary: 'COMMIT'
    })
    assert.deepEqual(summarizer.summarize('SELECT * FROM payment; DELETE FROM payment_archive'), {
      operation: 'SELECT',
      summary: 'SELECT payment DELETE payment_archive'
    })
  })

  it('returns undefined for unsupported SQL without throwing', () => {
    const summarizer = new SqlQuerySummarizer()

    assert.equal(summarizer.summarize('SAVEPOINT before_payment'), undefined)
    assert.equal(summarizer.summarize('not valid SQL'), undefined)
  })

  it('caches successful and failed parses', () => {
    let parseCount = 0
    const summarizer = new SqlQuerySummarizer(1000, (sql) => {
      parseCount++

      return parse(sql)
    })

    summarizer.summarize('SELECT * FROM payment')
    summarizer.summarize('SELECT * FROM payment')
    summarizer.summarize('not valid SQL')
    summarizer.summarize('not valid SQL')

    assert.equal(parseCount, 2)
  })

  it('evicts the least recently used cache entry', () => {
    let parseCount = 0
    const summarizer = new SqlQuerySummarizer(2, (sql) => {
      parseCount++

      return parse(sql)
    })

    summarizer.summarize('SELECT * FROM first_table')
    summarizer.summarize('SELECT * FROM second_table')
    summarizer.summarize('SELECT * FROM first_table')
    summarizer.summarize('SELECT * FROM third_table')
    summarizer.summarize('SELECT * FROM second_table')

    assert.equal(parseCount, 4)
  })

  it('caps summaries at a token boundary below 256 characters', () => {
    const summarizer = new SqlQuerySummarizer()
    const joins = Array.from({ length: 30 }, (_, index) => (
      `JOIN relation_${index} ON relation_${index}.id = root.relation_${index}_id`
    )).join(' ')
    const result = summarizer.summarize(`SELECT * FROM root ${joins}`)

    assert.ok(result)
    assert.ok(result.summary.length <= 255)
    assert.match(result.summary, /^(?:SELECT|[A-Za-z_][A-Za-z0-9_$]*)(?: (?:SELECT|[A-Za-z_][A-Za-z0-9_$]*))*$/u)
  })
})
