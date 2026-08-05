import { NumberOperation, NumberOperationApiProperty } from "#src/number/number-operation.js";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from 'class-transformer';
import { IsEnum, IsNumber } from "class-validator";

export class NumberFilter {
  @NumberOperationApiProperty()
  @IsEnum(NumberOperation)
  operation: NumberOperation

  @ApiProperty({type: "number"})
  @Type(() => Number)
  @IsNumber()
  value: number
}
