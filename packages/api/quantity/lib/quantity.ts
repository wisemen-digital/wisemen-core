import assert from 'assert'
import { Rate } from './rate/rate.js'

export interface Comparable {
  valueOf(): number
  isEqualTo (other: Comparable): boolean
  isLessThan (other: Comparable): boolean
  isLessThanOrEqualTo (other: Comparable): boolean
  isMoreThan (other: Comparable): boolean
  isMoreThanOrEqualTo (other: Comparable): boolean
}

export interface Quantity<U extends string = string> {
  value: number
  unit: U
  asNumber(unit?: U): number
}

export type QuantityConstructor<U extends string, Q extends Quantity<U>> = {
  new(quantity: Q): Q
  new(value: number, unit: U): Q
  new(value: 0): Q
  new(s: string): Q
}

export abstract class BaseQuantity<
  U extends string, 
  Q extends BaseQuantity<U, Q, D>, 
  D extends BaseQuantity<U, D, D>
> implements Quantity<U>, Comparable {
  protected abstract getQuantity (): QuantityConstructor<U, Q>
  protected abstract getDelta (): QuantityConstructor<U, D>
  protected abstract getBaseUnit (): U
  protected abstract getUnits (): readonly U[]
  protected abstract convertValueToBaseUnit (value: number, fromUnit: U): number
  protected abstract convertBaseUnitValueTo (value: number, toUnit: U): number

  readonly value: number
  readonly unit: U

  constructor (quantity: Q)
  constructor (value: number, unit: U)
  constructor (value: 0)
  constructor (s: string)
  constructor (quantityOrValue: Q | number | string, unit?: U) {
    if (this.isQuantity(quantityOrValue)) {
      this.value = quantityOrValue.value
      this.unit = quantityOrValue.unit
    } else if (quantityOrValue === 0) {
      this.value = 0
      this.unit = this.getBaseUnit()
    } else if (typeof quantityOrValue === 'string') {
      const parsedString = this.parseString(quantityOrValue, this.getUnits())
      this.value = parsedString.value
      this.unit = parsedString.unit
    } else {
      assert(unit !== undefined, 'Unit must be provided when constructing from a numeric value')
      this.value = quantityOrValue
      this.unit = unit
    }
  }

  protected isQuantity(quantityOrValue: unknown): quantityOrValue is Q {
    return quantityOrValue instanceof this.getQuantity()
  }

  protected isDelta(quantityOrValue: unknown): quantityOrValue is D {
    return quantityOrValue instanceof this.getDelta()
  }

  protected constructQuantity (quantityOrValue: Q | number, unit?: U): Q {
    const Constructor = this.getQuantity()

    if (this.isQuantity(quantityOrValue)) {
      return quantityOrValue
    } else {
      assert(unit !== undefined, 'Unit must be provided when constructing from a numeric value')

      return new Constructor(quantityOrValue, unit)
    }
  }

  protected constructDelta (quantityOrValue: D | number, unit?: U): D {
    const Constructor = this.getDelta()

    if (this.isDelta(quantityOrValue)) {
      return quantityOrValue
    } else {
      assert(unit !== undefined, 'Unit must be provided when constructing from a numeric value')

      return new Constructor(quantityOrValue, unit)
    }
  }

  /** Converts the quantity to the specified unit */
  to (unit: U): Q {
    const value = this.convertBaseUnitValueTo(this.valueOf(), unit)

    return this.constructQuantity(value, unit)
  }

  /** Returns the numeric value of the quantity in the specified unit */
  asNumber (unit: U = this.unit): number {
    return this.to(unit).value
  }

  /** Checks whether the quantity is equal to another quantity */
  isEqualTo (value: number, unit: U): boolean
  isEqualTo (quantity: Q): boolean
  isEqualTo (quantityOrValue: Q | number, unit?: U): boolean {
    const other = this.constructQuantity(quantityOrValue, unit)

    return this.valueOf() === other.valueOf()
  }

  /** Checks whether the quantity is less than another quantity */
  isLessThan (value: number, unit: U): boolean
  isLessThan (quantity: Q): boolean
  isLessThan (quantityOrValue: Q | number, unit?: U): boolean {
    const other = this.constructQuantity(quantityOrValue, unit)

    return this.valueOf() < other.valueOf()
  }

  /** Checks whether the quantity is less than or equal to another quantity */
  isLessThanOrEqualTo (value: number, unit: U): boolean
  isLessThanOrEqualTo (quantity: Q): boolean
  isLessThanOrEqualTo (quantityOrValue: Q | number, unit?: U): boolean {
    const other = this.constructQuantity(quantityOrValue, unit)

    return this.valueOf() <= other.valueOf()
  }

  /** Checks whether the quantity is more than another quantity */
  isMoreThan (value: number, unit: U): boolean
  isMoreThan (quantity: Q): boolean
  isMoreThan (quantityOrValue: Q | number, unit?: U): boolean {
    const other = this.constructQuantity(quantityOrValue, unit)

    return this.valueOf() > other.valueOf()
  }

  /** Checks whether the quantity is more than or equal to another quantity */
  isMoreThanOrEqualTo (value: number, unit: U): boolean
  isMoreThanOrEqualTo (quantity: Q): boolean
  isMoreThanOrEqualTo (quantityOrValue: Q | number, unit?: U): boolean {
    const other = this.constructQuantity(quantityOrValue, unit)

    return this.valueOf() >= other.valueOf()
  }

  /** Creates a new quantity by adding the current quantity to another quantity */
  add (value: number, unit: U): Q
  add (quantity: D): Q
  add (quantityOrValue: D | number, unit?: U): Q {
    const other = this.constructDelta(quantityOrValue, unit)

    return this.constructQuantity(this.valueOf() + other.valueOf(), this.getBaseUnit()).to(this.unit)
  }

  /** Creates a new quantity by subtracting another quantity from the current quantity */
  subtract (value: number, unit: U): Q
  subtract (quantity: Q): D
  subtract (quantity: D): Q
  subtract (quantityOrValue: Q | D | number, unit?: U): Q | D {
    let other: Q | D

    if (this.isDelta(quantityOrValue)){
      other = this.constructDelta(quantityOrValue, unit)

      return this.constructQuantity(this.valueOf() - other.valueOf(), this.getBaseUnit()).to(this.unit)
    }
    else {
      other = this.constructQuantity(quantityOrValue, unit)

      return this.constructDelta(this.valueOf() - other.valueOf(), this.getBaseUnit()).to(this.unit)
    }
  }

  /** Creates a new quantity by calculating the modulus of
   * the current quantity and another quantity */
  modulo (value: number, unit: U): Q
  modulo (quantity: Q): Q
  modulo (quantityOrValue: Q | number, unit?: U): Q {
    const other = this.constructQuantity(quantityOrValue, unit)

    return this.constructQuantity(this.valueOf() % other.valueOf(), this.getBaseUnit()).to(this.unit)
  }

  /** Ceils the value to the nearest integer for the current unit */
  ceil (): Q {
    return this.constructQuantity(Math.ceil(this.value), this.unit)
  }

  /** Rounds the value half up to the nearest integer for the current unit */
  round (): Q {
    return this.constructQuantity(Math.round(this.value), this.unit)
  }

  /** Floors the value to the nearest integer for the current unit */
  floor (): Q {
    return this.constructQuantity(Math.floor(this.value), this.unit)
  }

  /** Checks whether the value is an integer for the current unit */
  isRounded (): boolean {
    return Number.isInteger(this.value)
  }

  toString (): string {
    return `${this.value}${this.unit}`
  }

  valueOf (): number {
    return this.convertValueToBaseUnit(this.value, this.unit)
  }

  export (): { value: number, unit: U } {
    return {
      value: this.value,
      unit: this.unit
    }
  }

  toJSON (): object {
    return {
      value: this.value,
      unit: this.unit
    }
  }

  format (locale: string = 'en-US', options?: Intl.NumberFormatOptions): string {
    const formatter = new Intl.NumberFormat(locale, options)

    return `${formatter.format(this.value)} ${this.unit}`
  }

  /** Returns the maximum quantity from the provided quantities */
  static max<Q extends Comparable> (
    ...quantities: Q[]
  ): Q {
    return quantities.reduce((max, quantity) =>
      quantity.isMoreThan(max) ? quantity : max
    )
  }

  /** Returns the minimum quantity from the provided quantities */
  static min<Q extends Comparable> (
    ...quantities: Q[]
  ): Q {
    return quantities.reduce((min, quantity) =>
      quantity.isLessThan(min) ? quantity : min
    )
  }

  protected parseString (s: string, units: readonly U[]): { value: number, unit: U } {
    const unitsPattern = units.map(unit => BaseQuantity.escapeRegex(unit)).join('|')
    const pattern = new RegExp(`^(?<amount>[+-]?(?:\\d+\\.?\\d*|\\.\\d+)(?:e[+-]?\\d+)?)(?<unit>${unitsPattern})$`, 'u')
    const match = pattern.exec(s)
    const amount = match?.groups?.amount
    const unit = match?.groups?.unit as U | undefined

    if (amount === undefined || unit === undefined) {
      throw new Error(`Invalid quantity string ${s}, expected <amount>(${units.join(' | ')})`)
    }

    return { value: Number(amount), unit }
  }

  private static escapeRegex (value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
}

export abstract class ScalableQuantity<
  U extends string, 
  Q extends BaseQuantity<U, Q, D>, 
  D extends BaseQuantity<U, D, D>
> extends BaseQuantity<U, Q, D> {
  /** Creates a new quantity by multiplying the current quantity with the specified factor */
  multiply (scalar: number): Q
  multiply (rate: Rate): Q
  multiply (multiplier: number | Rate): Q
  multiply (multiplier: number | Rate): Q {
    const factor = multiplier instanceof Rate ? multiplier.asDecimal() : multiplier
    return this.constructQuantity(this.valueOf() * factor, this.getBaseUnit()).to(this.unit)
  }

  /** Creates a new quantity by dividing the current quantity by the specified divisor */
  divide (scalar: number): Q
  divide (rate: Rate): Q
  divide (value: number, unit: U): number
  divide (quantity: Q): number
  divide (divisor: number | Q | Rate, unit?: U): Q | number
  divide (divisor: number | Q | Rate, unit?: U): Q | number {
    if (divisor instanceof BaseQuantity || (typeof divisor === 'number' && unit !== undefined)) {
      const other = this.constructQuantity(divisor, unit)

      return this.valueOf() / other.valueOf()
    } else {
      const factor = divisor instanceof Rate ? divisor.asDecimal() : divisor
      return this.constructQuantity(this.valueOf() / factor, this.getBaseUnit()).to(this.unit)
    }
  }
}