import { Scope } from "#src/scope.js";
import { buildScopedEnumFilter } from "#src/scoped-enum-filter.js";
import { validate } from "class-validator";
import { expect } from "expect";
import { describe, it } from "node:test";

describe('ScopedEnumFilter unit tests', () => {
    it('creates a scoped enum filter', async () => {
        enum X {
            ALL = 'all',
            NONE = 'none'
        }

        const ScopedXFilter =  buildScopedEnumFilter(X, 'X')
        const filter = new ScopedXFilter(Scope.INCLUDE, [X.ALL, X.NONE])

        const errors = await validate(filter)
        expect(errors).toHaveLength(0)
        
        const invalidFilter = new ScopedXFilter(Scope.EXCLUDE, ['123' as X])
        const invalidErrors = await validate(invalidFilter)
        expect(invalidErrors).toHaveLength(1)
    })
})