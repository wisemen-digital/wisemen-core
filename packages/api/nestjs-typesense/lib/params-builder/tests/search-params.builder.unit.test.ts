import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Typesense } from '../../index.js'
import { TypesenseInvalidNumTyposError } from '../../errors/typesense-invalid-num-typos.error.js'

describe('TypesenseSearchParamsBuilder', () => {
  const products = Typesense.collection('products', {
    id: Typesense.string(),
    name: Typesense.string().sort().infix(),
    description: Typesense.string().optional()
  })

  describe('addSearchOn numTypos', () => {
    it('defaults to the maximum number of typos when none is given', () => {
      const params = Typesense.createSearchParamsBuilder(products)
        .addSearchOn(products.name)
        .build()

      expect(params.num_typos).toEqual([2])
    })

    it('uses the given number of typos', () => {
      const params = Typesense.createSearchParamsBuilder(products)
        .addSearchOn(products.name, undefined, 1)
        .addSearchOn(products.description, undefined, 0)
        .build()

      expect(params.num_typos).toEqual([1, 0])
    })

    it('throws a TypesenseInvalidNumTyposError when numTypos is negative', () => {
      expect(() => {
        Typesense.createSearchParamsBuilder(products)
          .addSearchOn(products.name, undefined, -1)
      }).toThrow(TypesenseInvalidNumTyposError)
    })

    it('throws a TypesenseInvalidNumTyposError when numTypos exceeds the maximum', () => {
      expect(() => {
        Typesense.createSearchParamsBuilder(products)
          .addSearchOn(products.name, undefined, 3)
      }).toThrow(TypesenseInvalidNumTyposError)
    })
  })
})
