import { Entity, PrimaryGeneratedColumn } from 'typeorm'
import { DateRange } from '../../date-range.js'
import { DateRangeColumn } from '../../typeorm/date-range-column.js'

@Entity()
export class FiniteDateRangeTest {
  @PrimaryGeneratedColumn()
  id: number

  @DateRangeColumn({ finiteOnly: true, nullable: true })
  range: DateRange | null
}
