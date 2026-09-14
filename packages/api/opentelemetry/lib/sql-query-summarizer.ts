import { astVisitor, parse, type QNameAliased, type Statement } from 'pgsql-ast-parser'

const DEFAULT_CACHE_SIZE = 1000
const MAX_SUMMARY_LENGTH = 255

export interface SqlQuerySummary {
  collection?: string
  operation: string
  summary: string
}

type ParseSql = (sql: string) => Statement[]

export class SqlQuerySummarizer {
  private readonly cache = new Map<string, SqlQuerySummary | null>()

  constructor (
    private readonly maxCacheSize = DEFAULT_CACHE_SIZE,
    private readonly parseSql: ParseSql = parse
  ) {}

  summarize (sql: string): SqlQuerySummary | undefined {
    const cached = this.cache.get(sql)

    if (cached !== undefined || this.cache.has(sql)) {
      this.cache.delete(sql)
      this.cache.set(sql, cached ?? null)

      return cached ?? undefined
    }

    const summary = this.parseSummary(sql)

    this.cache.set(sql, summary ?? null)
    if (this.cache.size > this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value

      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey)
      }
    }

    return summary
  }

  private parseSummary (sql: string): SqlQuerySummary | undefined {
    try {
      const statements = this.parseSql(sql)
      const tokens: string[] = []
      const operations: string[] = []
      const relations = new Set<string>()
      const addOperation = (operation: string): void => {
        const normalizedOperation = operation.toUpperCase()

        operations.push(normalizedOperation)
        tokens.push(normalizedOperation)
      }
      const addRelation = (relation: QNameAliased): void => {
        const name = formatRelation(relation)

        if (!relations.has(name)) {
          relations.add(name)
          tokens.push(name)
        }
      }
      const visitor = astVisitor(mapper => ({
        begin: (statement) => {
          addOperation('BEGIN')
          mapper.super().begin(statement)
        },
        delete: (statement) => {
          addOperation('DELETE')
          mapper.super().delete(statement)
        },
        insert: (statement) => {
          addOperation('INSERT')
          mapper.super().insert(statement)
        },
        selection: (statement) => {
          addOperation('SELECT')
          mapper.super().selection(statement)
        },
        tableRef: (relation) => {
          addRelation(relation)
          mapper.super().tableRef(relation)
        },
        transaction: (statement) => {
          addOperation(statement.type === 'start transaction' ? 'START' : statement.type)
          mapper.super().transaction(statement)
        },
        truncateTable: (statement) => {
          addOperation('TRUNCATE')
          mapper.super().truncateTable(statement)
        },
        update: (statement) => {
          addOperation('UPDATE')
          mapper.super().update(statement)
        }
      }))

      for (const statement of statements) {
        visitor.statement(statement)
      }

      const operation = operations[0]
      if (operation === undefined) {
        return undefined
      }

      const result: SqlQuerySummary = {
        operation,
        summary: truncateAtTokenBoundary(tokens, MAX_SUMMARY_LENGTH)
      }

      if (relations.size === 1) {
        result.collection = relations.values().next().value
      }

      return result
    } catch {
      return undefined
    }
  }
}

function formatIdentifier (identifier: string): string {
  if (/^[A-Za-z_][A-Za-z0-9_$]*$/.test(identifier)) {
    return identifier
  }

  return `"${identifier.replaceAll('"', '""')}"`
}

function formatRelation (relation: QNameAliased): string {
  const name = formatIdentifier(relation.name)

  return relation.schema === undefined
    ? name
    : `${formatIdentifier(relation.schema)}.${name}`
}

function truncateAtTokenBoundary (tokens: string[], maxLength: number): string {
  let summary = ''

  for (const token of tokens) {
    const candidate = summary === '' ? token : `${summary} ${token}`

    if (candidate.length > maxLength) {
      break
    }

    summary = candidate
  }

  return summary
}
