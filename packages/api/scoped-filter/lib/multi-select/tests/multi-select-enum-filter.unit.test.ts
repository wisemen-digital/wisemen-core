import { MultiSelectOperation } from "#src/multi-select/multi-select-operation.js";
import { buildMultiSelectEnumFilter } from "#src/multi-select/scoped-enum-filter.js";
import { validate } from "class-validator";
import { expect } from "expect";
import { describe, it } from "node:test";

describe('MultiSelectEnumFilter unit tests', () => {
    it('creates a multi select enum filter', async () => {
        enum X {
            ALL = 'all',
            NONE = 'none'
        }

        const ScopedXFilter =  buildMultiSelectEnumFilter(X, 'X')
        const filter = new ScopedXFilter(MultiSelectOperation.INCLUDE, [X.ALL, X.NONE])

        const errors = await validate(filter)
        expect(errors).toHaveLength(0)
        
        const invalidFilter = new ScopedXFilter(MultiSelectOperation.EXCLUDE, ['123' as X])
        const invalidErrors = await validate(invalidFilter)
        expect(invalidErrors).toHaveLength(1)
    })

    it('accepts an empty values array', async () => {
        enum X {
            ALL = 'all',
            NONE = 'none'
        }

        const ScopedXFilter =  buildMultiSelectEnumFilter(X, 'X')
        const filter = new ScopedXFilter(MultiSelectOperation.INCLUDE, [])

        const errors = await validate(filter)
        expect(errors).toHaveLength(0)
    })
})
