import { Readable } from 'node:stream'
import { CSV } from './csv.util.js'
import { CSVField } from './csv.field.js'
import { CSVFieldParseError } from './errors/csv-field-parse.error.js'
import { CSVSchemaParseError } from './errors/csv-schema-parse.error.js'
import { InferRow } from './infer.js'

export interface CsvParseOptions {
  delimiter?: string
}

// oxlint-disable-next-line typescript/no-explicit-any
export class CSVSchema<S extends { [key: string]: CSVField<any, any, any, any, any> }> {
  constructor (private fields: S) { }

  /** 
   * Parse a csv string which includes a header row to objects.  
   */
  parseString (csv: string, options?: CsvParseOptions): Promise<InferRow<S>[]> {
    const decoded = CSV.decode(csv, {
      delimiter: options?.delimiter
    })

    return this.parse(decoded)
  }

  /** 
   * Parse a csv string stream which includes a header row to objects.  
   */
  async * parseStream (stream: Readable, options?: CsvParseOptions): AsyncGenerator<InferRow<S>> {
    const rows = CSV.decodeStream(stream, {
      delimiter: options?.delimiter,
    })

    for await (const row of rows) {
      const [record, errors] = this.parseRow(row.data, row.line)
      if(errors.length > 0) {
        throw new CSVSchemaParseError(errors) 
      }

      yield record
    }
  }

  async parse (records: Record<string, string>[]): Promise<InferRow<S>[]> {
    const result: InferRow<S>[] = []
    const errors: CSVFieldParseError[] = []

    for (const [rowIndex, record] of records.entries()) {
      const [row, err]  = this.parseRow(record, rowIndex)
      result.push(row)
      errors.push(...err)
    }

    for (const [rowIndex, row] of result.entries()) {
      for (const column in this.fields) {
        try {
          await this.fields[column].refine(row[column], row, rowIndex, result)
        } catch (error) {
          if (error instanceof CSVFieldParseError) {
            errors.push(error)
          }
        }
      }
    }

    if (errors.length > 0) {
      throw new CSVSchemaParseError(errors)
    }

    return result
  }

  private parseRow (
    record: Record<string, string>, 
    rowIndex: number, 
  ): [InferRow<S>, CSVFieldParseError[]] {
    const row: Partial<InferRow<S>> = {}
    const errors: CSVFieldParseError[] = []

    for (const column in this.fields) {
      try {
        const field = this.fields[column]

        // oxlint-disable-next-line @typescript-eslint/no-unsafe-assignment
        row[column] = field.parse(record[field.name], rowIndex)
      } catch (error) {
        if (error instanceof CSVFieldParseError) {
          errors.push(error)
        }
      }
    }

    return [row as InferRow<S>, errors]
  }
}
