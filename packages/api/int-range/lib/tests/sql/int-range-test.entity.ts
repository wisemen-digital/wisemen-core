import { Entity, PrimaryColumn } from 'typeorm'
import { IntRange } from '#src/int-range.js'
import { IntRangeColumn } from '#src/typeorm/int-range-column.js'

@Entity()
export class IntRangeTest {
  @PrimaryColumn()
  id: number

  @IntRangeColumn()
  range: IntRange
}
