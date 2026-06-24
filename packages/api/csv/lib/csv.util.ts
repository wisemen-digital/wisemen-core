import { Readable } from 'node:stream'

export interface CSVRow<K extends string> {
  line: number
  data: Record<K, string>
}

const DEFAULT_DELIMITER = ';'
const DEFAULT_BATCH_SIZE = 100
const DEFAULT_MAX_CHUNK_BYTES = 64 * 1024

interface CSVOptions<K extends string> {
  /**
   * The expected column order. When omitted during encoding, the header row is
   * derived from the first record.
   */
  columns?: readonly K[]
  /**
   * The field separator used in the CSV payload.
   */
  delimiter?: string
}

interface EncodeStreamCSVOptions<K extends string> extends CSVOptions<K> {
  /** 
   * The amount of lines yielded to the readable per yield. Lines are buffered
   * internally until this amount is reached, or the last line has been encoded.
   * Must be > 0.
   */
  batchSize?: number
  /** 
   * The amount of bytes maximally yielded to the returned Readable. 
   * Buffers line internally until the bytes have been exceeded.
   * Must be > 0.
   */
  maxChunkBytes?: number
}


export class CSV {
  /**
   * Decode a CSV string into records keyed by the header row.
   * @param csv the CSV payload to parse.
   * @param options CSV delimiter and header options.
   * @returns The decoded records.
   */
  static decode<K extends string> (
    csv: string,
    options?: CSVOptions<K>
  ): Array<Record<K, string>> {
    const delimiter = options?.delimiter ?? DEFAULT_DELIMITER

    const records: string[][] = []
    let buffer = csv
    let end: number

    while ((end = findRecordEnd(buffer)) !== -1) {
      records.push(parseRecord(buffer.slice(0, end), delimiter))
      buffer = buffer.slice(end + 1)
    }

    if (buffer.length > 0) {
      records.push(parseRecord(buffer, delimiter))
    }

    if (records.length === 0) {
      return []
    }

    const [header, ...rows] = records
    const headerKeys = header.map(v => v.trim())

    return rows.map(values => mapRecord(headerKeys as K[], values))
  }

  /**
   * Decode a readable CSV stream into row objects with source line metadata.
   * @param stream the readable stream containing CSV chunks.
   * @param options CSV delimiter and header options.
   * @returns An async generator yielding parsed CSV rows.
   */
  static async* decodeStream<K extends string> (
    stream: Readable,
    options?: CSVOptions<K>
  ): AsyncGenerator<CSVRow<K>> {
    const delimiter = options?.delimiter ?? DEFAULT_DELIMITER

    let buffer = ''
    let lineNumber = 0
    let keys: K[] | null = null


    function* emit (text: string): Generator<CSVRow<K>> {
      lineNumber += countChar(text, '\n') + 1
      const values = parseRecord(text, delimiter)

      if (keys === null) {
        const headerKeys = values.map(v => v.trim())
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

  /**
   * Encode an array of records into a CSV.
   * @param data the array of records, when no columns are specified the keys 
   *  of the first object in the array are taken as the csv header row.
   * @param options CSV delimiter and CSV header options.
   * @returns The CSV as a string
   */
  static encode<K extends string> (
    data: Array<Record<K, string | null | undefined>>,
    options?: CSVOptions<K>
  ): string {
    const delimiter = options?.delimiter ?? DEFAULT_DELIMITER
    const keys = (options?.columns ?? Object.keys(data[0])) as K[]

    return [
      keys.map(k => escape(k, delimiter)).join(delimiter),
      ...data.map(row => keys.map(key => escape(row[key] ?? '', delimiter)).join(delimiter)),
    ].join('\n')
  }

  /**
   * Encode records into a readable stream of CSV chunks.
   * @param data the records to encode.
   * @param options CSV delimiter, header, and chunking options.
   * @returns A readable stream containing the encoded CSV.
   */
  static encodeStream<K extends string> (
    data: Iterable<Record<K, string | null | undefined>> |
      AsyncIterable<Record<K, string | null | undefined>>,
    options?: EncodeStreamCSVOptions<K>
  ): Readable {
    const delimiter = options?.delimiter ?? DEFAULT_DELIMITER
    const batchSize = options?.batchSize ?? DEFAULT_BATCH_SIZE
    const maxChunkBytes = options?.maxChunkBytes ?? DEFAULT_MAX_CHUNK_BYTES

    let keys: readonly K[] | null = options?.columns ?? null

    const iterator = (async function* () {
      let headerWritten = false
      let lineCount = 0
      let chunkBytes = 0
      let lines: string[] = []

      function writeHeader (headerKeys: readonly K[]): void {
        const header = headerKeys.map(k => escape(k, delimiter)).join(delimiter) + '\n'
        lines.push(header)
        chunkBytes += Buffer.byteLength(header)
        headerWritten = true
      }

      for await (const row of data) {
        if (!headerWritten) {
          keys = keys ?? (Object.keys(row) as K[])
          writeHeader(keys)
        }

        const line = keys!.map(key => escape(row[key] ?? '', delimiter)).join(delimiter) + '\n'
        lines.push(line)
        lineCount++
        chunkBytes += Buffer.byteLength(line)

        if (lineCount >= batchSize || chunkBytes >= maxChunkBytes) {
          yield lines.join('')

          lines = []
          lineCount = 0
          chunkBytes = 0
        }
      }

      if (!headerWritten && keys !== null) {
        writeHeader(keys)
      }

      if (lines.length > 0) {
        yield lines.join('')
      }
    })()

    return Readable.from(iterator)
  }
}

function findRecordEnd (buf: string): number {
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


function parseRecord (text: string, delimiter: string): string[] {
  const fields: string[] = []
  let field = ''
  let inQuotes = false
  const delimiterLength = delimiter.length

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
    } else if (
      delimiterLength > 0 &&
      text.startsWith(delimiter, i)
    ) {
      fields.push(field)
      field = ''
      i += delimiterLength - 1
    } else if (ch !== '\r') {
      field += ch
    }
  }

  fields.push(field)
  return fields
}

function mapRecord<K extends string> (
  keys: readonly K[],
  values: string[]
): Record<K, string> {
  const data = {} as Record<K, string>

  keys.forEach((key, index) => { data[key] = values[index] ?? '' })

  return data
}

function escape (value: string, delimiter: string): string {
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

function countChar (text: string, ch: string): number {
  let n = 0
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ch) n++
  }
  return n
}
