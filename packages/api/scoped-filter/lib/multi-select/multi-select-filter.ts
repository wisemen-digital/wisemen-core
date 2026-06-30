import { MultiSelectOperationApiProperty, MultiSelectOperation } from "#src/multi-select/multi-select-operation.js"
import { ArrayMinSize, ArrayUnique, IsArray, IsEnum } from "class-validator"

export interface MultiSelectFilter<T>{
    operation: MultiSelectOperation
    values: T[]
}

export interface MultiSelectFilterConstructor<T> {
    new (operation: MultiSelectOperation, values: T[]): MultiSelectFilter<T>
}

export function buildMultiSelectFilter<T>(
    name: string,
    valueApiProperty: PropertyDecorator,
    valueValidator: PropertyDecorator,
): MultiSelectFilterConstructor<T>  {
    const C: MultiSelectFilterConstructor<T> =  class {
        operation: MultiSelectOperation;
        values: T[]

        constructor(operation: MultiSelectOperation, values: T[]) {
            this.operation = operation
            this.values = values
        }
    }

    Object.defineProperty(C, 'name', {value: name})
    const prototype = C.prototype as object

    MultiSelectOperationApiProperty()(prototype, 'operation')
    IsEnum(MultiSelectOperation)(prototype, 'operation')

    valueApiProperty(prototype, 'values')
    valueValidator(prototype, 'values')
    IsArray()(prototype, 'values')
    ArrayMinSize(1)(prototype, 'values')
    ArrayUnique()(prototype, 'values')

    return C
}
