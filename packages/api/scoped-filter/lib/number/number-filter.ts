import { NumberOperation, NumberOperationApiProperty } from "#src/number/number-operation.js";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber } from "class-validator";

export class NumberFilter {
  @NumberOperationApiProperty()
  @IsEnum(NumberOperation)
  operation: NumberOperation

  @ApiProperty({type: "number"})
  @IsNumber()
  value: number
}
