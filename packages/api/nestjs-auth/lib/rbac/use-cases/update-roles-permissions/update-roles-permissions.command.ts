import type { Type } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Type as TransformType } from 'class-transformer'
import { IsArray, IsEnum, IsObject, IsUUID, ValidateNested } from 'class-validator'
import type { PermissionEnum } from '../../rbac.types.js'

export interface UpdateRolesPermissionsCommand<TPermission extends string> {
  roles: Array<{
    roleUuid: string
    permissions: TPermission[]
  }>
}

export function createUpdateRolesPermissionsCommand<TPermission extends string> (
  permissions: PermissionEnum<TPermission>,
  permissionEnumName: string
): Type<UpdateRolesPermissionsCommand<TPermission>> {
  class UpdateRolesPermissionsCommandItem {
    @ApiProperty({ format: 'uuid' })
    @IsUUID()
    roleUuid: string

    @ApiProperty({ enum: permissions, enumName: permissionEnumName, isArray: true })
    @IsEnum(permissions, { each: true })
    permissions: TPermission[]
  }

  class DynamicUpdateRolesPermissionsCommand implements UpdateRolesPermissionsCommand<TPermission> {
    @ApiProperty({ type: UpdateRolesPermissionsCommandItem, isArray: true })
    @ValidateNested({ each: true })
    @IsObject({ each: true })
    @IsArray()
    @TransformType(() => UpdateRolesPermissionsCommandItem)
    roles: UpdateRolesPermissionsCommandItem[]
  }

  return DynamicUpdateRolesPermissionsCommand
}
