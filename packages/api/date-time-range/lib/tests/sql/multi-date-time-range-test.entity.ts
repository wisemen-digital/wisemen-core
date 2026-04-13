import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { DateTimeRange } from '#src/date-time-range.js'
import { DateTimeMultiRangeColumn } from '#src/typeorm/multi-date-time-range.column.js'

@Entity()
export class MultiDateTimeRangeTest {
  @PrimaryGeneratedColumn()
  id: number

  @DateTimeMultiRangeColumn()
  ranges: DateTimeRange[]
}
