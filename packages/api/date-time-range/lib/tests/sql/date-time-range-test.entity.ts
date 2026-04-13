import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { DateTimeRange } from '#src/date-time-range.js'
import { DateTimeRangeColumn } from '#src/typeorm/date-time-range-column.js'

@Entity()
export class DateTimeRangeTest {
  @PrimaryGeneratedColumn()
  id: number

  @DateTimeRangeColumn()
  range: DateTimeRange
}
