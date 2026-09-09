import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, IsOptional, IsUUID } from 'class-validator'

export class ClearRolePermissionsCacheCommand {
  @ApiProperty({
    type: String,
    isArray: true,
    format: 'uuid',
    required: false,
    nullable: true,
    description: 'Clears the cache for all roles when omitted or null'
  })
  @IsOptional()
  @IsUUID('all', { each: true })
  @IsArray()
  @ArrayMinSize(1)
  roleUuids?: string[] | null
}
