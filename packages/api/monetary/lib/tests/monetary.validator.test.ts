import { describe, it } from 'node:test'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { plainToInstance } from 'class-transformer'
import { MonetaryDto, MonetaryDtoBuilder } from '#src/monetary.dto.js'
import { IsMonetary } from '#src/monetary.validator.js'
import { Currency } from '#src/currency.enum.js'
import { Monetary } from '../monetary.js'

describe('Monetary validator tests', () => {
  class Test {
    @IsMonetary({ maxPrecision: 4, allowedCurrencies: new Set<Currency>([Currency.EUR]) })
    foo: MonetaryDto<Currency.EUR>
  }

  it('does not have errors for a valid object', async () => {
    const dto = new Test()

    dto.foo = new MonetaryDtoBuilder(Currency.EUR).build()

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true
    })

    expect(errors).toHaveLength(0)
  })

  it('does have error if amount is string', async () => {
    const dto = plainToInstance(MonetaryDto, {
      amount: 'test',
      currency: Currency.USD,
      precision: 4
    })

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true
    })

    expect(errors).toHaveLength(1)
  })

  it('does have error if precision is string', async () => {
    const dto = plainToInstance(MonetaryDto, {
      amount: 1,
      currency: Currency.USD,
      precision: 'test'
    })

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true
    })

    expect(errors).toHaveLength(1)
  })

  it('does have error if currency is not valid', async () => {
    const dto = plainToInstance(MonetaryDto, {
      amount: 1,
      currency: 'xxx',
      precision: 4
    })

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true
    })

    expect(errors).toHaveLength(1)
  })

  it('does have error if object is empty', async () => {
    const dto = plainToInstance(MonetaryDto, {})

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true
    })

    expect(errors).toHaveLength(3)
  })

  describe('IsMonetaryMinAmountValidator', () => {
    const MIN_AMOUNT = new Monetary(10, Currency.EUR, 0)

    class MinTest {
      @IsMonetary({
        maxPrecision: 4,
        allowedCurrencies: new Set<Currency>([Currency.EUR]),
        min: MIN_AMOUNT
      })
      foo: MonetaryDto<Currency.EUR>
    }

    it('has errors if amount is lower than min amount', async () => {
      const dto = new MinTest()

      dto.foo = new MonetaryDtoBuilder(Currency.EUR)
        .withAmount(MIN_AMOUNT.toPrecision(4).amount - 1)
        .withPrecision(4)
        .build()

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      })

      expect(errors).toHaveLength(1)
    })

    it('has no errors if amount is equal to min amount', async () => {
      const dto = new MinTest()

      dto.foo = new MonetaryDtoBuilder(Currency.EUR)
        .withAmount(MIN_AMOUNT.toPrecision(4).amount)
        .withPrecision(4)
        .build()

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      })

      expect(errors).toHaveLength(0)
    })

    it('has no errors if amount is higher than min amount', async () => {
      const dto = new MinTest()

      dto.foo = new MonetaryDtoBuilder(Currency.EUR)
        .withAmount(MIN_AMOUNT.toPrecision(4).amount + 1)
        .withPrecision(4)
        .build()

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      })

      expect(errors).toHaveLength(0)
    })
  })

  describe('IsMonetaryMaxAmountValidator', () => {
    const MAX_AMOUNT = new Monetary(100, Currency.EUR, 0)

    class MaxTest {
      @IsMonetary({
        maxPrecision: 4,
        allowedCurrencies: new Set<Currency>([Currency.EUR]),
        max: MAX_AMOUNT
      })
      foo: MonetaryDto<Currency.EUR>
    }

    it('has errors if amount is higher than max amount', async () => {
      const dto = new MaxTest()

      dto.foo = new MonetaryDtoBuilder(Currency.EUR)
        .withAmount(MAX_AMOUNT.toPrecision(4).amount + 1)
        .withPrecision(4)
        .build()

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      })

      expect(errors).toHaveLength(1)
    })

    it('has no errors if amount is equal to max amount', async () => {
      const dto = new MaxTest()

      dto.foo = new MonetaryDtoBuilder(Currency.EUR)
        .withAmount(MAX_AMOUNT.toPrecision(4).amount)
        .withPrecision(4)
        .build()

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      })

      expect(errors).toHaveLength(0)
    })

    it('has no errors if amount is lower than max amount', async () => {
      const dto = new MaxTest()

      dto.foo = new MonetaryDtoBuilder(Currency.EUR)
        .withAmount(MAX_AMOUNT.toPrecision(4).amount - 1)
        .withPrecision(4)
        .build()

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true
      })

      expect(errors).toHaveLength(0)
    })
  })
})
