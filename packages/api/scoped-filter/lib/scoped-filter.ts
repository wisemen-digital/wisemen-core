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
    const C: any =  class {
        scope: Scope;
        values: T[]

        constructor(scope: Scope, values: T[]) {
            this.scope = scope
            this.values = values
        }
    }

    Object.defineProperty(C, 'name', {value: name})

    FilterScopeApiProperty()(C.prototype, 'scope')
    IsEnum(Scope)(C.prototype, 'scope')

    valueApiProperty(C.prototype, 'values')
    valueValidator(C.prototype, 'values')
    IsArray()(C.prototype, 'values')
    ArrayMinSize(1)(C.prototype, 'values')
    ArrayUnique()(C.prototype, 'values')

    return C as ScopedFilterConstructor<T>
}