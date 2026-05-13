import { describe, it } from 'node:test'
import { Readable } from 'node:stream'
import { CSV, CSVRow } from '../csv.util.js'
import { expect } from 'expect'
import { CSVMissingColumnError } from '../errors/csv-missing-column.error.js'


describe('CSV util', () => {
  describe('decode stream', () => {
    it('decodes a csv stream', async () => {
      const rawText = `name\nJohn Doe\nJane Doe`
      const stream = Readable.from(rawText)

      const rows: CSVRow<'name'>[] = []
      for await (const row of CSV.decodeStream(stream, { columns: ['name'] })) {
        rows.push(row)
      }

      expect(rows).toHaveLength(2)
      expect(rows).toEqual([
        { line: 2, data: { name: 'John Doe' } },
        { line: 3, data: { name: 'Jane Doe' } }
      ])
    })

    it('decodes a csv stream with custom delimiter', async () => {
      const rawText = `name,age\nJohn Doe,30\nJane Doe,25`
      const stream = Readable.from(rawText)

      const rows: CSVRow<'name' | 'age'>[] = []
      for await (const row of CSV.decodeStream(stream, { columns: ['name', 'age'], delimiter: ',' })) {
        rows.push(row)
      }

      expect(rows).toHaveLength(2)
      expect(rows).toEqual([
        { line: 2, data: { name: 'John Doe', age: '30' } },
        { line: 3, data: { name: 'Jane Doe', age: '25' } }
      ])
    })

    it('throws an error if required columns are missing in stream', async () => {
      const rawText = `name;age\nJohn Doe;30\nJane Doe;25`
      const stream = Readable.from(rawText)

      try {
        for await (const _ of CSV.decodeStream(stream, { columns: ['name', 'age', 'gender'] })) {
          // do nothing
        }

        expect(true).toBe(false) // force fail if no error is thrown
      } catch (error) {
        expect(error).toEqual(new CSVMissingColumnError(['gender']))
      }
    })
  })

  describe('decode', () => {
    it('decode a csv string', () => {
      const csv = `name;age\nJohn Doe;30\nJane Doe;25`
      const result = CSV.decode(csv, { columns: ['name', 'age'] })

      expect(result).toEqual([
        { name: 'John Doe', age: '30' },
        { name: 'Jane Doe', age: '25' }
      ])
    })

    it('decodes a csv string with custom delimiter', () => {
      const csv = `name,age\nJohn Doe,30\nJane Doe,25`
      const result = CSV.decode(csv, { columns: ['name', 'age'], delimiter: ',' })

      expect(result).toEqual([
        { name: 'John Doe', age: '30' },
        { name: 'Jane Doe', age: '25' }
      ])
    })

    it('throws an error if required columns are missing', () => {
      const csv = `name;age\nJohn Doe;30\nJane Doe;25`

      expect(() => CSV.decode(csv, { columns: ['name', 'age', 'gender'] }))
      .toThrow(new CSVMissingColumnError(['gender']))
    })
  })

  describe('encode stream', () => {
    it('encodes a csv stream', async () => {
      const data = [
        { name: 'John Doe', age: '30' },
        { name: 'Jane Doe', age: '25' }
      ]

      const stream = CSV.encodeStream(data, { columns: ['name', 'age'] })
      let rawText = ''

      for await (const chunk of stream) {
        rawText += chunk.toString()
      }

      expect(rawText).toBe(`name;age\nJohn Doe;30\nJane Doe;25\n`)
    })

    it('encodes a csv stream with custom delimiter', async () => {
      const data = [
        { name: 'John Doe', age: '30' },
        { name: 'Jane Doe', age: '25' }
      ]

      const stream = CSV.encodeStream(data, { columns: ['name', 'age'], delimiter: ',' })
      let rawText = ''

      for await (const chunk of stream) {
        rawText += chunk.toString()
      }

      expect(rawText).toBe(`name,age\nJohn Doe,30\nJane Doe,25\n`)
    })
  })

  describe('encode', () => {
    it('encodes objects to a csv string', () => {
      const data = [
        { name: 'John Doe', age: '30' },
        { name: 'Jane Doe', age: '25' }
      ]

      const csv = CSV.encode(data, { columns: ['name', 'age'] })

      expect(csv).toBe(`name;age\nJohn Doe;30\nJane Doe;25`)
    })

    it('encodes objects to a csv string with custom delimiter', () => {
      const data = [
        { name: 'John Doe', age: '30' },
        { name: 'Jane Doe', age: '25' }
      ]

      const csv = CSV.encode(data, { columns: ['name', 'age'], delimiter: ',' })

      expect(csv).toBe(`name,age\nJohn Doe,30\nJane Doe,25`)
    })
  })
})
