import { ApiProperty } from '@nestjs/swagger';
import { IsUndefinable } from '@wisemen/validators';
import { IsNotEmpty, IsString } from 'class-validator';

export class ViewCustomFieldDefinitionsQuery {
  @ApiProperty({ type: String, required: false })
  @IsUndefinable()
  @IsString()
  @IsNotEmpty()
  entityType?: string
}