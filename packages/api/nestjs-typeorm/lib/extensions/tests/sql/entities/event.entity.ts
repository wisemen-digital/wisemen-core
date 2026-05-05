import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * A simple transformer that mimics @wisemen/datewise PlainDateTransformer behavior.
 * Converts between string values in JS and 'date' type in DB.
 * The key behavior: to() calls .toString() on non-null values.
 */
const plainDateTransformer = {
  from (value: string | null): string | null {
    return value
  },
  to (value: string | null | undefined): string | null | undefined {
    if (value == null) {
      return value
    }

    return value.toString()
  }
}

@Entity()
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'date', transformer: plainDateTransformer })
  date: string

  @Column({ type: 'varchar' })
  name: string
}
