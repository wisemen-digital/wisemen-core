import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * Upsert needs a conflict target backed by a unique constraint. The other test entities only have
 * a generated primary key, which the insert omits, so nothing ever conflicts.
 */
@Entity()
export class UpsertableEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', unique: true })
  key: string

  @Column({ type: 'int' })
  value: number
}
