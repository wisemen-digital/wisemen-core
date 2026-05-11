import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { PlainDate } from '../../../plain-date/index.js'
import { PlainDateColumn } from '../../../plain-date/typeorm/plain-date.column.js'

@Entity()
export class PlainDateTest {
  @PrimaryGeneratedColumn()
  id: number

  @PlainDateColumn()
  date: PlainDate
}
