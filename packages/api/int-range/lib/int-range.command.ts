import { FilterQuery } from '@wisemen/pagination'
import { IsNumberString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IntRange } from './int-range.js'

export class IntRangeDto extends FilterQuery {
  @ApiProperty({ type: 'string', example: '100' })
  @IsNumberString()
  start: string

  @ApiProperty({ type: 'string', example: '200' })
  @IsNumberString()
  end: string

  parse (): IntRange {
    return new IntRange(parseInt(this.start), parseInt(this.end))
  }
}
