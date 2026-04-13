import { ApiProperty } from '@nestjs/swagger'
import { IntRange } from './int-range.js'

export class IntRangeResponse {
  @ApiProperty({ type: Number })
  start: number

  @ApiProperty({ type: Number })
  end: number

  constructor (intRange: IntRange) {
    this.start = intRange.from
    this.end = intRange.until
  }
}
