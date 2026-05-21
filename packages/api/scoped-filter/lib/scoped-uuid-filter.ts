import { FilterScopeApiProperty, Scope } from "#src/scope.js"
import { ApiProperty } from "@nestjs/swagger"
import { ArrayMinSize, IsArray, IsUUID } from "class-validator"

export class ScopedUuidFilter<T extends string>  {
    @FilterScopeApiProperty()
    scope: Scope

    @ApiProperty({type: 'string', format: 'uuid', isArray: true})
    @IsArray()
    @ArrayMinSize(1)
    @IsUUID('all', {each: true})
    uuids: T[]
}