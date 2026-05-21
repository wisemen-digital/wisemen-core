import { buildScopedFilter, ScopedFilterConstructor } from "#src/scoped-filter.js"
import { ApiProperty } from "@nestjs/swagger"
import { IsEnum } from "class-validator"

/**
 * Returns a new scoped filter class built specifically for a provided enum.
 * This class can be used in queries as it contains the api property and class-validator decorators.
 * 
 * @param e the enum
 * @param enumName the name of the enum
 * 
 * @example const ScopedUserRoleFilter = buildScopedEnumFilter(UserRole, 'UserRole')
 */
export function buildScopedEnumFilter<E extends object>(e: E, enumName: string): ScopedFilterConstructor<E[keyof E]> {
    return buildScopedFilter<E[keyof E]>(
        `Scoped${enumName}Filter`,
        ApiProperty({enum: e, enumName, isArray: true}),
        IsEnum(e, {each: true})
    )
}