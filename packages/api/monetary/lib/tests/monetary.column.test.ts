import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Currency } from '#src/currency.enum.js'
import { MoneyTypeOrmTransformer } from '#src/monetary.column.js'
import { Monetary } from '#src/monetary.js'

describe('MoneyTypeOrmTransformer', () => {
  it('falls back to the configured precision for legacy rows', () => {
    const transformer = new MoneyTypeOrmTransformer(2, { [Currency.EUR]: 4 } as Record<Currency, number>)

    const monetary = transformer.from({
      amount: 95000,
      currency: Currency.EUR
    })

    expect(monetary).toEqual(new Monetary(95000, Currency.EUR, 4))
  })

  it('does not include precision by default when serializing', () => {
    const transformer = new MoneyTypeOrmTransformer(2, {} as Record<Currency, number>)

    const monetary = transformer.to(new Monetary(950, Currency.EUR, 2))

    expect(monetary).toEqual({
      amount: 950,
      currency: Currency.EUR,
      precision: undefined
    })
  })

  it('includes precision when explicitly requested and reads it back', () => {
    const writer = new MoneyTypeOrmTransformer(4, {} as Record<Currency, number>)
    const reader = new MoneyTypeOrmTransformer(2, {} as Record<Currency, number>)

    const serialized = writer.to(new Monetary(950, Currency.EUR, 2), true)
    const monetary = reader.from(serialized!)

    expect(serialized).toEqual({
      amount: 95000,
      currency: Currency.EUR,
      precision: 4
    })
    expect(monetary).toEqual(new Monetary(95000, Currency.EUR, 4))
  })
})
