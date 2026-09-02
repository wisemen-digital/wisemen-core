import { PlainDate, PlainDateColumn, Timestamp, TimestampColumn } from '@wisemen/datewise'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ScopedFilterTest {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'uuid' })
  uuid: string

  @Column({ type: 'integer' })
  amount: number

  @PlainDateColumn()
  date: PlainDate

  @TimestampColumn({ nullable: true })
  timestamp?: Timestamp | null
}
