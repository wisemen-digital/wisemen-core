import { buildScopedFilter, ScopedFilter } from "#src/scoped-filter.js"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export const ScopedUuidFilter = buildScopedFilter<string>(
    'ScopedUuidFilter',
    ApiProperty({type: 'string', format: 'uuid', isArray: true}),
    IsUUID('all', {each: true}),
)

// Interface for the instance type with 'uuids' property
export type ScopedUuidFilter<T extends string> = ScopedFilter<T>
