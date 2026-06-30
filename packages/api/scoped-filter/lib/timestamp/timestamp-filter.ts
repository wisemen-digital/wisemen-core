import { TimestampOperation, TimestampOperationApiProperty, TimestampRangeOperation, TimestampSingleOperation } from '#src/timestamp/timestamp-operation.js'
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { isEnum, IsEnum } from 'class-validator'
import { DateTimeRangeDto, IsDateTimeRange, IsTimestamp } from '@wisemen/datewise'
import { ValidateWhen } from '@wisemen/validators'

@ApiExtraModels(DateTimeRangeDto)
// eslint-disable-next-line @typescript-eslint/naming-convention
class _TimestampFilter {
  @TimestampOperationApiProperty()
  @IsEnum(TimestampOperation)
  operation: TimestampOperation

  @ApiProperty({
    oneOf: [
      {
        oneOf: [
          { type: 'string', format: 'date-time' },
        ]
      },
      { $ref: getSchemaPath(DateTimeRangeDto) }
    ]
  })
  @ValidateWhen([IsTimestamp()], (f: _TimestampFilter) => isEnum(f.operation, TimestampSingleOperation))
  @ValidateWhen([IsDateTimeRange()], (f: _TimestampFilter) => isEnum(f.operation, TimestampRangeOperation))
  value: string | DateTimeRangeDto
}

export const TimestampFilter = _TimestampFilter

export type TimestampFilter =
  { operation: TimestampSingleOperation, value: string }
  | { operation: TimestampRangeOperation, value: DateTimeRangeDto }
