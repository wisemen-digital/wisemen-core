import { describe, it } from 'node:test'
import { Readable } from 'node:stream'
import { CSV, CSVRow } from '../csv.util.js'
import { expect } from 'expect'


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

    it('decodes a csv stream with a multi-character delimiter', async () => {
      const rawText = `name||age\nJohn Doe||30\nJane Doe||25`
      const stream = Readable.from(rawText)

      const rows: CSVRow<'name' | 'age'>[] = []
      for await (const row of CSV.decodeStream(stream, { columns: ['name', 'age'], delimiter: '||' })) {
        rows.push(row)
      }

      expect(rows).toEqual([
        { line: 2, data: { name: 'John Doe', age: '30' } },
        { line: 3, data: { name: 'Jane Doe', age: '25' } }
      ])
    })

    it('decodes a quoted field containing the delimiter', async () => {
      const rawText = `name;note\n"Smith;Jones";hello\n`
      const stream = Readable.from(rawText)

      const rows: CSVRow<'name' | 'note'>[] = []
      for await (const row of CSV.decodeStream(stream, { columns: ['name', 'note'] })) {
        rows.push(row)
      }

      expect(rows).toEqual([
        { line: 2, data: { name: 'Smith;Jones', note: 'hello' } }
      ])
    })

    it('decodes a field with an escaped double-quote (RFC 4180 "")', async () => {
      const rawText = `name;note\nJohn;"says ""hello"""\n`
      const stream = Readable.from(rawText)

      const rows: CSVRow<'name' | 'note'>[] = []
      for await (const row of CSV.decodeStream(stream, { columns: ['name', 'note'] })) {
        rows.push(row)
      }

      expect(rows).toEqual([
        { line: 2, data: { name: 'John', note: 'says "hello"' } }
      ])
    })

    it('decodes a quoted field with an embedded newline', async () => {
      const rawText = `name;note\nJohn;"line1\nline2"\n`
      const stream = Readable.from(rawText)

      const rows: CSVRow<'name' | 'note'>[] = []
      for await (const row of CSV.decodeStream(stream, { columns: ['name', 'note'] })) {
        rows.push(row)
      }

      expect(rows).toEqual([
        { line: 3, data: { name: 'John', note: 'line1\nline2' } }
      ])
    })

    it('handles a "" pair split across two stream chunks', async () => {
      // RFC 4180 encoding of va"l is "va""l".
      // Split so the "" pair straddles the boundary: first chunk ends after the
      // first " of the pair, second chunk starts with the second ".
      const stream = Readable.from(['name;note\n"va"', '"l";30\n'])

      const rows: CSVRow<'name' | 'note'>[] = []
      for await (const row of CSV.decodeStream(stream, { columns: ['name', 'note'] })) {
        rows.push(row)
      }

      expect(rows).toEqual([
        { line: 2, data: { name: 'va"l', note: '30' } }
      ])
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

    it('decodes a csv string with a multi-character delimiter', () => {
      const csv = `name||age\nJohn Doe||30\nJane Doe||25`
      const result = CSV.decode(csv, { columns: ['name', 'age'], delimiter: '||' })

      expect(result).toEqual([
        { name: 'John Doe', age: '30' },
        { name: 'Jane Doe', age: '25' }
      ])
    })

    it('decodes a quoted field containing the delimiter', () => {
      const csv = `name;note\n"Smith;Jones";hello`
      const result = CSV.decode(csv, { columns: ['name', 'note'] })

      expect(result).toEqual([
        { name: 'Smith;Jones', note: 'hello' }
      ])
    })

    it('decodes a field with an escaped double-quote (RFC 4180 "")', () => {
      const csv = `name;note\nJohn;"says ""hello"""`
      const result = CSV.decode(csv, { columns: ['name', 'note'] })

      expect(result).toEqual([
        { name: 'John', note: 'says "hello"' }
      ])
    })

    it('decodes a quoted field with an embedded newline', () => {
      const csv = `name;note\nJohn;"line1\nline2"`
      const result = CSV.decode(csv, { columns: ['name', 'note'] })

      expect(result).toEqual([
        { name: 'John', note: 'line1\nline2' }
      ])
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
        rawText += String(chunk)
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
        rawText += String(chunk)
      }

      expect(rawText).toBe(`name,age\nJohn Doe,30\nJane Doe,25\n`)
    })

    it('encodes a csv stream with batch size', async () => {
      const data = [
        { name: 'John Doe', age: '30' },
        { name: 'Jane Doe', age: '25' },
        { name: 'Jack Doe', age: '20' }
      ]

      const stream = CSV.encodeStream(data, { columns: ['name', 'age'], batchSize: 1, maxChunkBytes: Number.MAX_SAFE_INTEGER })

      const chunks: string[] = []

      for await (const chunk of stream) {
        chunks.push(String(chunk))
      }

      expect(chunks).toEqual([
        'name;age\nJohn Doe;30\n',
        'Jane Doe;25\n',
        'Jack Doe;20\n'
      ])
    })

    it('encodes a csv stream with max chunk bytes', async () => {
      const data = [
        { name: 'John Doe', age: '30' },
        { name: 'Jane Doe', age: '25' },
        { name: 'Jack Doe', age: '20' }
      ]

      const stream = CSV.encodeStream(data, {
        columns: ['name', 'age'],
        maxChunkBytes: 20,
        batchSize: Number.MAX_SAFE_INTEGER
      })

      const chunks: string[] = []

      for await (const chunk of stream) {

        chunks.push(String(chunk))
      }

      expect(chunks).toEqual([
        'name;age\nJohn Doe;30\n',
        'Jane Doe;25\nJack Doe;20\n'
      ])
    })

    it('quotes a value that contains the delimiter', async () => {
      const data = [{ name: 'Smith;Jones', note: 'hello' }]
      const stream = CSV.encodeStream(data, { columns: ['name', 'note'] })
      let rawText = ''
      for await (const chunk of stream) rawText += String(chunk)

      expect(rawText).toBe(`name;note\n"Smith;Jones";hello\n`)
    })

    it('quotes a value that contains a double-quote and doubles it', async () => {
      const data = [{ name: 'John', note: 'says "hello"' }]
      const stream = CSV.encodeStream(data, { columns: ['name', 'note'] })
      let rawText = ''
      for await (const chunk of stream) rawText += String(chunk)

      expect(rawText).toBe(`name;note\nJohn;"says ""hello"""\n`)
    })

    it('quotes a value that contains a newline', async () => {
      const data = [{ name: 'John', note: 'line1\nline2' }]
      const stream = CSV.encodeStream(data, { columns: ['name', 'note'] })
      let rawText = ''
      for await (const chunk of stream) rawText += String(chunk)

      expect(rawText).toBe(`name;note\nJohn;"line1\nline2"\n`)
    })

    it('renders null and undefined values as empty fields', async () => {
      const data = [{ name: null, age: undefined }] as Array<Record<'name' | 'age', string | null | undefined>>
      const stream = CSV.encodeStream(data, { columns: ['name', 'age'] })
      let rawText = ''
      for await (const chunk of stream) rawText += String(chunk)

      expect(rawText).toBe(`name;age\n;\n`)
    })

    it('renders missing requested columns as empty fields', async () => {
      const data = [{ name: 'John Doe' }] as Array<Record<'name' | 'age', string | null | undefined>>
      const stream = CSV.encodeStream(data, { columns: ['name', 'age'] })
      let rawText = ''
      for await (const chunk of stream) rawText += String(chunk)

      expect(rawText).toBe(`name;age\nJohn Doe;\n`)
    })

    it('emits only the header when the iterable is empty and columns are provided', async () => {
      const stream = CSV.encodeStream([], { columns: ['name', 'age'] })
      let rawText = ''
      for await (const chunk of stream) rawText += String(chunk)

      expect(rawText).toBe(`name;age\n`)
    })

    it('emits nothing when the iterable is empty and no columns are provided', async () => {
      const stream = CSV.encodeStream([])
      let rawText = ''
      for await (const chunk of stream) rawText += String(chunk)

      expect(rawText).toBe('')
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

    it('quotes a value that contains the delimiter', () => {
      const data = [{ name: 'Smith;Jones', note: 'hello' }]
      const csv = CSV.encode(data, { columns: ['name', 'note'] })

      expect(csv).toBe(`name;note\n"Smith;Jones";hello`)
    })

    it('quotes a value that contains a double-quote and doubles it', () => {
      const data = [{ name: 'John', note: 'says "hello"' }]
      const csv = CSV.encode(data, { columns: ['name', 'note'] })

      expect(csv).toBe(`name;note\nJohn;"says ""hello"""`);
    })

    it('quotes a value that contains a newline', () => {
      const data = [{ name: 'John', note: 'line1\nline2' }]
      const csv = CSV.encode(data, { columns: ['name', 'note'] })

      expect(csv).toBe(`name;note\nJohn;"line1\nline2"`)
    })

    it('renders null and undefined values as empty fields', () => {
      const data = [{ name: null, age: undefined }] as Array<Record<'name' | 'age', string | null | undefined>>
      const csv = CSV.encode(data, { columns: ['name', 'age'] })

      expect(csv).toBe(`name;age\n;`)
    })

    it('renders missing requested columns as empty fields', () => {
      const data = [{ name: 'John Doe' }] as Array<Record<'name' | 'age', string | null | undefined>>
      const csv = CSV.encode(data, { columns: ['name', 'age'] })

      expect(csv).toBe(`name;age\nJohn Doe;`)
    })
  })

  describe('round-trip (encode → decode)', () => {
    it('round-trips rows with delimiter, quote, and newline in values', () => {
      const original = [
        { name: 'Smith;Jones', note: 'says "hi"' },
        { name: 'Jane\nDoe', note: 'line1\nline2' },
      ]

      const csv = CSV.encode(original, { columns: ['name', 'note'] })
      const result = CSV.decode(csv, { columns: ['name', 'note'] })

      expect(result).toEqual(original)
    })

    it('round-trips rows with a multi-character delimiter', () => {
      const original = [
        { name: 'John Doe', age: '30' },
        { name: 'Jane Doe', age: '25' }
      ]

      const csv = CSV.encode(original, { columns: ['name', 'age'], delimiter: '||' })
      const result = CSV.decode(csv, { columns: ['name', 'age'], delimiter: '||' })

      expect(result).toEqual(original)
    })

    it('round-trips rows through encodeStream → decodeStream', async () => {
      const original = [
        { name: 'Smith;Jones', note: 'says "hi"' },
        { name: 'Jane\nDoe', note: 'line1\nline2' },
      ]

      const encoded = CSV.encodeStream(original, { columns: ['name', 'note'] })
      const rows: CSVRow<'name' | 'note'>[] = []
      for await (const row of CSV.decodeStream(encoded, { columns: ['name', 'note'] })) {
        rows.push(row)
      }

      expect(rows.map(r => r.data)).toEqual(original)
    })
  })
})
