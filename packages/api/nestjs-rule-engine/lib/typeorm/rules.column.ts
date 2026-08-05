import { Column, type ColumnOptions } from 'typeorm'

/**
 * Creates a `jsonb` TypeORM column for persisted rule definitions.
 */
export function RulesColumn(options: Omit<ColumnOptions, 'type'>): PropertyDecorator {
  return Column({ ...options, type: 'jsonb' })
}
