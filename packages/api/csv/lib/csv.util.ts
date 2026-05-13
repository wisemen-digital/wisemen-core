import { Readable } from 'node:stream'
import readline from 'node:readline'
import { CSVMissingColumnError } from './errors/csv-missing-column.error.js'

export interface CSVRow<K extends string> {
  line: number
  data: Record<K, string>
}

export class CSV {
  static decode <K extends string> (
    csv: string,
    options?: {
      columns?: readonly K[]
      delimiter?: string
    }
  ): Array<Record<K, string>> {
    const delimiter = options?.delimiter ?? ';'

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
    const delimiter = options?.delimiter ?? ';'

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
    const delimiter = options?.delimiter ?? ';'

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
    }
  ): Readable {
    const delimiter = options?.delimiter ?? ';'
    let keys: readonly K[] | null = options?.columns ?? null

    const iterator = (async function* () {
      let headerWritten = false

      for await (const row of data) {
        if (!headerWritten) {
          keys = keys ?? Object.keys(row) as K[]
          yield keys.join(delimiter) + '\n'
          headerWritten = true
        }

        const line = keys!
          .map(key => row[key] ?? '')
          .join(delimiter)

        yield line + '\n'
      }
    })()

    return Readable.from(iterator)
  }
}
