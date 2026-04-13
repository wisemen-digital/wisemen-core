import { Entity, PrimaryColumn } from 'typeorm'
import { IntRange } from '#src/int-range.js'
import { IntMultiRangeColumn } from '#src/typeorm/multi-int-range.column.js'

@Entity()
export class MultiIntRangeTest {
  @PrimaryColumn()
  id: number

  @IntMultiRangeColumn()
  ranges: IntRange[]
}
