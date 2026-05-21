import { FilterScopeApiProperty, Scope } from "#src/scope.js"
import { ArrayMinSize, ArrayUnique, IsArray, IsEnum } from "class-validator"


export interface ScopedFilter<T> {
    scope: Scope
    values: T[]
}

export interface ScopedFilterConstructor<T> {
    new (scope: Scope, values: T[]): ScopedFilter<T>
}

export function buildScopedFilter<T>(
    name: string,
    valueApiProperty: PropertyDecorator,
    valueValidator: PropertyDecorator,
): ScopedFilterConstructor<T>  {
    const C: ScopedFilterConstructor<T> =  class {
        scope: Scope;
        values: T[]

        constructor(scope: Scope, values: T[]) {
            this.scope = scope
            this.values = values
        }
    }

    Object.defineProperty(C, 'name', {value: name})
    const prototype = Object.getPrototypeOf(C) as object

    FilterScopeApiProperty()(prototype, 'scope')
    IsEnum(Scope)(prototype, 'scope')

    valueApiProperty(prototype, 'values')
    valueValidator(prototype, 'values')
    IsArray()(prototype, 'values')
    ArrayMinSize(1)(prototype, 'values')
    ArrayUnique()(prototype, 'values')

    return C
}