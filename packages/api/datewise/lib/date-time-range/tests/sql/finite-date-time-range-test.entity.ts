import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { DateTimeRange } from '../../date-time-range.js'
import { DateTimeRangeColumn } from '../../typeorm/date-time-range-column.js'

@Entity()
export class FiniteDateTimeRangeTest {
  @PrimaryGeneratedColumn()
  id: number

  @DateTimeRangeColumn({ finiteOnly: true, nullable: true })
  range: DateTimeRange | null
}
