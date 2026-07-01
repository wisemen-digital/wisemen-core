import { PlainDateOperation, PlainDateOperationApiProperty, PlainDateRangeOperation, PlainDateSingleOperation } from "#src/plain-date/plain-date-operation.js"
import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger"
import { isEnum, IsEnum } from "class-validator"
import { DateRangeDto, IsDateRange, IsPlainDate } from "@wisemen/datewise"
import { ValidateWhen } from "@wisemen/validators"

@ApiExtraModels(DateRangeDto)
// eslint-disable-next-line @typescript-eslint/naming-convention
class _PlainDateFilter {
  @PlainDateOperationApiProperty()
  @IsEnum(PlainDateOperation)
  operation: PlainDateOperation

  @ApiProperty({
    oneOf: [
      { type: 'string', format: 'date' },
      { $ref: getSchemaPath(DateRangeDto) }
    ]
  })
  @ValidateWhen([IsPlainDate()], (f: _PlainDateFilter) => isEnum(f.value, PlainDateSingleOperation))
  @ValidateWhen([IsDateRange()], (f: _PlainDateFilter) => isEnum(f.value, PlainDateRangeOperation))
  value: string | DateRangeDto
}

export const PlainDateFilter = _PlainDateFilter

export type PlainDateFilter =
  { operation: PlainDateSingleOperation, value: string }
  | { operation: PlainDateRangeOperation, value: DateRangeDto }