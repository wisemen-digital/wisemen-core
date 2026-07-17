import { Readable, Transform, TransformCallback } from 'node:stream'

export interface CSVRow<K extends string> {
  line: number
  data: Record<K, string>
}

const DEFAULT_DELIMITER = ';'

interface CSVOptions {
  /**
   * The field separator used in the CSV payload.
   */
  delimiter?: string
}

interface EncodeCsvOptions<K extends string> extends CSVOptions {
  /**
    * The expected column order. When omitted during encoding, the header row is
    * derived from the first record.
    */
  columns?: readonly K[]
}

interface EncodeStreamCSVOptions<K extends string> extends EncodeCsvOptions<K> {}

export class CSV {
  /**
   * Decode a CSV string into records keyed by the header row.
   * @param csv the CSV payload to parse.
   * @param options CSV delimiter and header options.
   * @returns The decoded records.
   */
  static decode<K extends string> (
    csv: string,
    options?: CSVOptions
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
    options?: CSVOptions
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
    options?: EncodeCsvOptions<K>
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
    return Readable.from(data).pipe(new CSVEncodeTransform(options))
  }

  /**
   * Create a transform stream that encodes row objects into CSV text.
   * @param options CSV delimiter and header options.
   * @returns A transform stream that writes objects and emits CSV chunks.
   */
  static encodeTransform<K extends string>(
    options?: EncodeStreamCSVOptions<K>
  ): CSVEncodeTransform<K> {
    return new CSVEncodeTransform(options)
  }
}

type CSVValue = string | null | undefined

export class CSVEncodeTransform<K extends string> extends Transform {
  private readonly delimiter: string

  private keys: readonly K[] | null
  private headerWritten = false

  constructor(options?: EncodeStreamCSVOptions<K>) {
    super({
      writableObjectMode: true,
      readableObjectMode: false
    })

    this.delimiter = options?.delimiter ?? DEFAULT_DELIMITER
    this.keys = options?.columns ?? null
  }

  override _transform(
    row: Record<K, CSVValue>,
    _encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    try {
      if (!this.headerWritten) {
        this.keys = this.keys ?? (Object.keys(row) as K[])
        this.writeHeader(this.keys)
      }

      const line = this.keys!
        .map((key) => escape(row[key] ?? '', this.delimiter))
        .join(this.delimiter) + '\n'

      this.push(line)
      callback()
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)))
    }
  }

  override _flush(callback: TransformCallback): void {
    try {
      if (!this.headerWritten && this.keys !== null) {
        this.writeHeader(this.keys)
      }

      callback()
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)))
    }
  }

  private writeHeader(keys: readonly K[]): void {
    const header = keys.map((k) => escape(k, this.delimiter)).join(this.delimiter) + '\n'
    this.push(header)
    this.headerWritten = true
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
