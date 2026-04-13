export function mapTypeToDbml (tsType: string): string {
  const typeMap: Record<string, string> = {
    string: 'varchar',
    number: 'integer',
    boolean: 'boolean',
    Date: 'timestamp',
    any: 'text'
  }

  return typeMap[tsType] || 'varchar'
}
