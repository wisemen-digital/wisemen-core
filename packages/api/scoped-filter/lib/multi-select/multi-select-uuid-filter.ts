import { buildMultiSelectFilter, MultiSelectFilter } from "#src/multi-select/multi-select-filter.js"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export const MultiSelectUuidFilter = buildMultiSelectFilter<string>(
    'ScopedUuidFilter',
    ApiProperty({type: 'string', format: 'uuid', isArray: true}),
    IsUUID('all', {each: true}),
)

export type MultiSelectUuidFilter<T extends string> = MultiSelectFilter<T>
