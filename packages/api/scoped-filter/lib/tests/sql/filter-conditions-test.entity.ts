import {
  DateRange,
  DateRangeColumn,
  DateTimeRange,
  DateTimeRangeColumn,
  PlainDate,
  PlainDateColumn,
  Timestamp,
  TimestampColumn
} from '@wisemen/datewise'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class FilterConditionsTest {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer' })
  amount: number

  @TimestampColumn()
  timestamp: Timestamp

  @PlainDateColumn()
  date: PlainDate

  @DateTimeRangeColumn()
  dateTimeRange: DateTimeRange

  @DateRangeColumn()
  dateRange: DateRange
}
