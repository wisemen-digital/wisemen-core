import { Readable } from 'node:stream'
import { CSVMissingColumnError } from './errors/csv-missing-column.error.js'

export interface CSVRow<K extends string> {
  line: number
  data: Record<K, string>
}

const DEFAULT_DELIMITER = ';'
const DEFAULT_BATCH_SIZE = 100
const DEFAULT_MAX_CHUNK_BYTES = 64 * 1024

function escapeField(value: string, delimiter: string): string {
  if (
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes('\n') ||
    value.includes('\r')
  ) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function countChar(text: string, ch: string): number {
  let n = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ch) n++
  }
  return n
}

function findRecordEnd(buf: string): number {
  let inQuotes = false
  for (let i = 0; i < buf.length; i++) {
    const ch = buf[i]
    if (ch === '"') {
      if (inQuotes && buf[i + 1] === '"') {
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === '\n' && !inQuotes) {
      return i
    }
  }
  return -1
}

function parseFields(text: string, delimiter: string): string[] {
  const fields: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
    } else if (ch === '"' && field === '') {
      inQuotes = true
    } else if (ch === delimiter) {
      fields.push(field)
      field = ''
    } else if (ch !== '\r') {
      field += ch
    }
  }

  fields.push(field)
  return fields
}

function assertColumns<K extends string>(
  headerKeys: string[],
  columns: readonly K[] | undefined
): void {
  const missing = columns?.filter(column => !headerKeys.includes(column)) ?? []
  if (missing.length > 0) {
    throw new CSVMissingColumnError(missing)
  }
}

function mapRecord<K extends string>(keys: readonly K[], values: string[]): Record<K, string> {
  const data = {} as Record<K, string>
  keys.forEach((key, index) => {
    data[key] = values[index] ?? ''
  })
  return data
}

export class CSV {
  static decode<K extends string>(
    csv: string,
    options?: {
      columns?: readonly K[]
      delimiter?: string
    }
  ): Array<Record<K, string>> {
    const delimiter = options?.delimiter ?? DEFAULT_DELIMITER

    const records: string[][] = []
    let buffer = csv
    let end: number
    while ((end = findRecordEnd(buffer)) !== -1) {
      records.push(parseFields(buffer.slice(0, end), delimiter))
      buffer = buffer.slice(end + 1)
    }
    if (buffer.length > 0) {
      records.push(parseFields(buffer, delimiter))
    }

    if (records.length === 0) {
      return []
    }

    const [header, ...rows] = records
    const headerKeys = header.map(v => v.trim())

    assertColumns(headerKeys, options?.columns)

    return rows.map(values => mapRecord(headerKeys as K[], values))
  }

  static async* decodeStream<K extends string>(
    stream: Readable,
    options?: {
      columns?: readonly K[]
      delimiter?: string
      /** @deprecated No longer used — kept for back-compat. */
      crlfDelay?: number
    }
  ): AsyncGenerator<CSVRow<K>> {
    const delimiter = options?.delimiter ?? DEFAULT_DELIMITER

    let buffer = ''
    let lineNumber = 0
    let keys: K[] | null = null

    function* emit(text: string): Generator<CSVRow<K>> {
      lineNumber += countChar(text, '\n') + 1
      const values = parseFields(text, delimiter)

      if (keys === null) {
        const headerKeys = values.map(v => v.trim())
        assertColumns(headerKeys, options?.columns)
        keys = headerKeys as K[]
        return
      }

      yield { line: lineNumber, data: mapRecord(keys, values) }
    }

    for await (const chunk of stream) {
      buffer += String(chunk)
      let end: number
      while ((end = findRecordEnd(buffer)) !== -1) {
        yield* emit(buffer.slice(0, end))
        buffer = buffer.slice(end + 1)
      }
    }

    if (buffer.length > 0) {
      yield* emit(buffer)
    }
  }

  static encode<K extends string>(
    data: Array<Record<K, string | null | undefined>>,
    options?: {
      columns?: readonly K[]
      delimiter?: string
    }
  ): string {
    const delimiter = options?.delimiter ?? DEFAULT_DELIMITER
    const keys = (options?.columns ?? Object.keys(data[0])) as K[]

    return [
      keys.map(key => escapeField(key, delimiter)).join(delimiter),
      ...data.map(item =>
        keys.map(key => escapeField(item[key as string] ?? '', delimiter)).join(delimiter)
      ),
    ].join('\n')
  }

  static encodeStream<K extends string>(
    data: Iterable<Record<K, string | null | undefined>> | AsyncIterable<Record<K, string | null | undefined>>,
    options?: {
      columns?: readonly K[]
      delimiter?: string
      batchSize?: number
      maxChunkBytes?: number
    }
  ): Readable {
    const delimiter = options?.delimiter ?? DEFAULT_DELIMITER
    const batchSize = Math.max(1, options?.batchSize ?? DEFAULT_BATCH_SIZE)
    const maxChunkBytes = Math.max(1, options?.maxChunkBytes ?? DEFAULT_MAX_CHUNK_BYTES)

    let keys: readonly K[] | null = options?.columns ?? null

    const iterator = (async function* () {
      let headerWritten = false
      let rowCount = 0
      let chunkBytes = 0
      let chunks: string[] = []

      function writeHeader(headerKeys: readonly K[]): void {
        const header = headerKeys.map(k => escapeField(k, delimiter)).join(delimiter) + '\n'
        chunks.push(header)
        chunkBytes += Buffer.byteLength(header)
        headerWritten = true
      }

      for await (const row of data) {
        if (!headerWritten) {
          keys = keys ?? (Object.keys(row) as K[])
          writeHeader(keys)
        }

        const line =
          keys!
            .map(key => escapeField(row[key] ?? '', delimiter))
            .join(delimiter) + '\n'

        chunks.push(line)

        rowCount++
        chunkBytes += Buffer.byteLength(line)

        if (
          rowCount >= batchSize ||
          chunkBytes >= maxChunkBytes
        ) {
          yield chunks.join('')

          chunks = []
          rowCount = 0
          chunkBytes = 0
        }
      }

      if (!headerWritten && keys !== null) {
        writeHeader(keys)
      }

      if (chunks.length > 0) {
        yield chunks.join('')
      }
    })()

    return Readable.from(iterator)
  }
}
