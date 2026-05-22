import { Readable } from 'node:stream'
import readline from 'node:readline'
import { CSVMissingColumnError } from './errors/csv-missing-column.error.js'

export interface CSVRow<K extends string> {
  line: number
  data: Record<K, string>
}

const DEFAULT_DELIMITER = ';'
const DEFAULT_BATCH_SIZE = 100
const DEFAULT_MAX_CHUNK_BYTES = 64 * 1024

export class CSV {
  static decode <K extends string> (
    csv: string,
    options?: {
      columns?: readonly K[]
      delimiter?: string
    }
  ): Array<Record<K, string>> {
    const delimiter = options?.delimiter ?? DEFAULT_DELIMITER

    const [keys, ...data] = csv
      .replace(/(\\r)/gm, '')
      .replace(/(\r)/gm, '')
      .replace(/(\\n)/gm, '\n')
      .replace(/(\n)/gm, '\n')
      .trim()
      .split('\n')
      .map(item => item.split(delimiter))

    const missingColumns = options?.columns?.filter(column => !keys.includes(column)) ?? []

    if (missingColumns.length > 0) {
      throw new CSVMissingColumnError(missingColumns)
    }

    return data.map(values =>
      keys.reduce<Record<string, string>>((record, key, index) => ({
        ...record,
        [key]: values.at(index) ?? ''
      }), {})
    )
  }

  static async* decodeStream<K extends string>(
    stream: Readable,
    options?: {
      columns?: readonly K[]
      delimiter?: string
    }
  ): AsyncGenerator<CSVRow<K>> {
    const delimiter = options?.delimiter ?? DEFAULT_DELIMITER

    const rl = readline.createInterface({
      input: stream,
      crlfDelay: Infinity
    })

    let keys: K[] | null = null
    let lineNumber = 0

    for await (const line of rl) {
      lineNumber++

      const sanitizedLine = line.trim()
      const values = sanitizedLine.split(delimiter)

      if (keys === null) {
        const sanitizedKeys = values.map(value => value.trim())
        const missingColumns = options?.columns?.filter(column =>
          !sanitizedKeys.includes(column)
        ) ?? []

        if (missingColumns.length > 0) {
          throw new CSVMissingColumnError(missingColumns)
        }

        keys = sanitizedKeys as K[]

        continue
      }

      const record = {} as Record<K, string>
      keys.forEach((key, index) => {
        record[key] = values[index] ?? ''
      })

      yield { line: lineNumber, data: record }
    }
  }

  static encode <K extends string> (
    data: Array<Record<K, string>>,
    options?: {
      columns?: readonly K[]
      delimiter?: string
    }
  ): string {
    const keys = options?.columns ?? Object.keys(data[0])
    const delimiter = options?.delimiter ?? DEFAULT_DELIMITER

    return [
      keys.join(delimiter),
      ...data.map(item =>
        keys.map(key => item[key as string] as string).join(delimiter)
      )
    ].join('\n')
  }

  static encodeStream<K extends string>(
    data: Iterable<Record<K, string>> | AsyncIterable<Record<K, string>>,
    options?: {
      columns?: readonly K[]
      delimiter?: string
      batchSize?: number
      maxChunkBytes?: number,

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

      for await (const row of data) {
        if (!headerWritten) {
          keys = keys ?? (Object.keys(row) as K[])

          const header =
            keys.join(delimiter) + '\n'

          chunks.push(header)
          chunkBytes += Buffer.byteLength(header)

          headerWritten = true
        }

        const line =
          keys!
            .map(key => row[key] ?? '')
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

      if (chunks.length > 0) {
        yield chunks.join('')
      }
    })()

    return Readable.from(iterator)
  }
}
