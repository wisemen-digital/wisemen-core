import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Timestamp } from '../../../timestamp/timestamp.js'
import { TimestampColumn } from '../../../timestamp/typeorm/timestamp.column.js'

@Entity()
export class TimestampTest {
  @PrimaryGeneratedColumn()
  id: number

  @TimestampColumn()
  timestamp: Timestamp
}
